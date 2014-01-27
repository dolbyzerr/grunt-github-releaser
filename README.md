# grunt-github-releaser

> Task for automated github releases

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-github-releaser --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-github-releaser');
```

## The "github-release" task

### Overview
In your project's Gruntfile, add a section named `github-release` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  "github-release": {
    options: {
      repository: 'dolbyzerr/grunt-github-releaser', // Path to repository
      auth: {   // Auth credentials
        user: 'dolbyzerr',
        password: ''
      }
    },
    files: {
      src: ['dist/release.zip'] // Files that you want to attach to Release
    }

  },
});
```

### Options

#### options.repository
Type: `String`
Default value: ``

Repository path in `:owner/:repo` format.


#### options.auth
Type: `String`

Basic authorization, see "Personal Access Tokens" in https://github.com/settings/applications

#### options.release
Type: `Object`

Here you can provide custom release settings, according http://developer.github.com/v3/repos/releases/#create-a-release
These section is tottaly optional. If no `tag_name` specified than `version` field, from `package.json` will be used.

### Usage Examples

This example will:
 - Create tag, from `package.json` version field. For example: `0.1.16`
 - Create Release named `0.1.16`
 - Upload `release.zip` from `dest` folder, and attach it to release

```js
grunt.initConfig({
  github_releaser: {
    options: {
      repository: 'dolbyzerr/grunt-github-releaser',
      auth: {
        user: 'dolbyzerr',
        password: '123'
      }
    },
    files: {
      'dest': ['release.zip'],
    },
  },
});
```

#### Custom Release Options
In this example, custom release options are used to specify custom name, description, prerelease state etc.

```js
grunt.initConfig({
  github_releaser: {
    options: {
      repository: 'dolbyzerr/grunt-github-releaser',
      auth: {
        user: 'dolbyzerr',
        password: '123'
      },
      release: {
        tag_name: 'v3-rc',
        name: 'jelly-bean',
        body: 'Description of the release',
        draft: false, 
        prerelease: true
      }
    },
    files: {
      'dest': ['release.zip'],
    },
  },
});
```
## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
