/*
 * grunt-github-releaser
 * https://github.com/dolbyzerr/grunt-github-releaser
 *
 * Copyright (c) 2014 Andrey Terentyev
 * Licensed under the MIT license.
 */

'use strict';

var request = require('request'),
    fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    async = require('async');

module.exports = function(grunt) {

  grunt.registerMultiTask('github-release', 'Plugin for automated github releases', function() {

    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      api: "https://api.github.com/repos/",
      version: grunt.file.readJSON('package.json').version,
    });

    var addRelease = function (releaseName, cb) {
        request.post({
          url: options.api + options.repository + '/releases',
          body: _.extend({"tag_name": releaseName}, options.release || {})
        }, cb);
    };

    var getReleases = function (cb) {
        request.get({
          url: options.api + options.repository + '/releases'
        }, cb);
    };

    var deleteRelease = function(release, cb){
        request.del(release.url, cb);
    };

    var uploadAsset = function (options, cb) {
        fs.stat(options.file, function (err, stats) {
          fs.createReadStream(options.file).pipe(
            request.post(makeUploadUrl(options.upload_url, path.basename(options.file)), {
              auth: options.auth,
              headers: {
                "Content-Type": "application/zip",
                "Content-Length": stats.size
              }
            }, cb)
          );
        });
    };

    var makeUploadUrl = function (uploadUrl, filename) {
        return uploadUrl.replace(/{(\S+)}/gi, '?name=' + filename);
    };

    var showError = function (err, noExit) {
        if (!err) {
            grunt.log.error("Something is terribly wrong");
        } else if (({}).toString.call(err) === '[object Array]') {
            err.forEach(function (error) {
                showError(error);
            });
        } else if (err === Object(err)) {
            grunt.log.error(JSON.stringify(err));
        } else {
            grunt.log.error(err);
        }
        return !noExit && done(1);
    };

    // Init
    if (!options.repository) {
      return showError(['"repository" must be specified']);
    }

    //Default request options
    request = request.defaults({
      json: true,
      headers: { 'User-Agent': 'Grunt Github release task' },
      auth: options.auth
    });

    var files = this.files;

    getReleases(function(err, resp, releases){
      if(err){ return showError(err); }

      // console.log(releases);
      // async.map(releases, deleteRelease, function(err, success){
      //   console.log('ok', err, success);
      // });

      addRelease(options.version, function (err, resp, release) {
        if(err || (release.errors && release.errors.length > 0)){
          return showError(["Error while creating release " + options.version + ":", err || release.errors]);
        }

        files.forEach(function(f){
          var src = f.src.filter(function(filepath) {
            if (!grunt.file.exists(filepath)) {
              grunt.log.warn('Source file "' + filepath + '" not found.');
              return false;
            } else {
              return true;
            }
          });

          src = src.map(function(file){
            return {
              "upload_url": release.upload_url,
              "file": file
            };
          });

          async.map(src, uploadAsset, function(err, result){
            if(err) return showError('Some files failed to upload');

            grunt.log.oklns('Upload complete');
            done();
          });

        });

      });
    });

  });

};
