'use strict';
var path = require('path');
var touch = require("touch");
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.NamedBase.extend({

  init: function () {
    var pkg = this.fs.readJSON('package.json', {name: 'projectName'});
    this.projectName = pkg.name;
  },

  askFor: function () {
    var done = this.async();

    var prompts = [
      {
        name: 'rootFolder',
        message: 'Where do you want to place this module?',
        default: 'app'
      },
      {
        type: "checkbox",
        name: "modules",
        message: "Please select module's dependencies?",
        choices: [{
          value: 'templates',
          name: 'Template Caching',
          checked: true
        }, {
          value: 'uiRouter',
          name: 'UI-Router',
          checked: true
        }, {
          value: 'ngResource',
          name: 'Angular Resource',
          checked: false
        }, {
          value: 'ngCookies',
          name: 'Angular Cookies',
          checked: false
        }]
      }
    ];

    this.prompt(prompts, function (props) {
      this.rootFolder = props.rootFolder;

      var hasMod = function (mod) { return props.modules.indexOf(mod) !== -1; };
      this.templateModule = hasMod('templates');
      this.uiRouterModule = hasMod('uiRouter');
      this.ngResourceModule = hasMod('ngResource');
      this.ngCookiesModule = hasMod('ngCookies');

      done();
    }.bind(this));
  },

  files: function () {
    this.camelModuleName = this._.camelize(this.name);
    this.capitalModuleName = this._.capitalize(this.name);
    this.lowerModuleName = this.name.toLowerCase();
    var modulePath = path.join('src', this.rootFolder, this.camelModuleName);
    this.mkdir(modulePath);

    this.template('_module.module.js', path.join(modulePath, this.camelModuleName + '.module.js'));

    this._processDirectory('module', '');
  //  this._addModuleToAppJs(this.projectName, this.camelModuleName, this.lowerModuleName);
  },

  touchIndexHtml: function() {
    // Touch the index.html file to force the index grunt task to rebuild it (that task adds the new module to the scripts)
    var indexHtmlFilePath = 'src/index.html';
    touch(indexHtmlFilePath, {mtime: true});
  },

  _processDirectory: function (source, destination) {
    var root = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);
    var files = this.expandFiles('**', { dot: true, cwd: root });

    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      var src = path.join(root, f);
      if (path.basename(f).indexOf('_') == 0) {
        var dest = path.join(destination, path.dirname(f), path.basename(f).replace(/^_/, ''));
        this.template(src, dest);
      }
      else {
        var dest = path.join(destination, f);
        this.copy(src, dest);
      }
    }
  },

  _addModuleToAppJs: function app(projectName, camelModuleName, lowerModuleName) {
    var hook   = '])));',
      path   = 'src/app/app.js',
      insert = "    '" + projectName + "." + camelModuleName + "',\n";

    var file   = this.readFileAsString(path);

    if (file.indexOf(insert) === -1) {
      this.write(path, file.replace(hook, insert + hook));
    }
  }

});
