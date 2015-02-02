'use strict';
var path = require('path');
var touch = require("touch");
var yeoman = require('yeoman-generator');
var esprima = require('esprima');
var escodegen = require('escodegen');

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
    var modulePath = path.join(this.env.cwd, 'src', this.rootFolder, this.camelModuleName);
    var viewPath = path.join(modulePath, 'views');
    this.mkdir(modulePath);
    this.mkdir(viewPath);

    this.template('_module.module.js', path.join(modulePath, this.camelModuleName + '.module.js'));
    this.template('_module.tpl.html', path.join(viewPath, this.camelModuleName + '.tpl.html'));

  //  this._processDirectory('module', '');
    this._updateAppJs(this.camelModuleName);
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

  _updateAppJs: function (camelModuleName) {
    var filePath = path.join(this.env.cwd, 'src', 'app', 'app.js');
    var file = this.readFileAsString(filePath);
    var start = file.indexOf('[');
    var end = file.indexOf(']');

    if (!file || start === -1 || end === -1) {
      return false;
    }

    var substr = file.substring(start, end + 1);
    var parsed = esprima.parse(substr);
    var module = esprima.parse("'" + camelModuleName + "'");
    parsed.body[0].expression.elements.push(module.body[0].expression);
    var newFile = file.slice(0, start) + escodegen.generate(parsed).slice(0, -1) + file.slice(end + 1);
    this.writeFileFromString(newFile, filePath);
  }

});
