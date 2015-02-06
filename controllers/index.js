'use strict';
var fs = require('fs-extra');
var path = require('path');
var yeoman = require('yeoman-generator');
//var esprima = require('esprima');
//var escodegen = require('escodegen');

module.exports = yeoman.generators.NamedBase.extend({

  init: function () {
    var pkg = this.fs.readJSON('package.json', {name: 'projectName'});
    this.projectName = pkg.name;
  },

  askFor: function () {
    var done = this.async();

    var getModulePath = function (rootPath) {
      rootPath = rootPath || 'app';
      return path.join(this.env.cwd, 'src', rootPath, this.name);
    }.bind(this);

    var moduleExists = function (rootPath) {
      return fs.existsSync(getModulePath(rootPath));
    };

    var prompts = [];

    if (!moduleExists()) {
      prompts.push({
        name: 'modulePath',
        message: 'Where is the location of this module?',
        default: 'app',
        validate: moduleExists
      });
    }

    prompts.push({
      name: 'customPath',
      message: 'Which directory to place controller?',
      default: 'controllers'
    });

    this.prompt(prompts, function (props) {
      this.modulePath = getModulePath(props.modulePath);
      this.customPath = props.customPath;
      done();
    }.bind(this));
  },

  files: function () {
    this.capitalModuleName = this._.capitalize(this.name);
    this.camelModuleName = this._.camelize(this.name);

    var controllerPath = path.join(this.modulePath, this.customPath);
    this.mkdir(controllerPath);

    this.template('_module.controller.js', path.join(controllerPath, this.camelModuleName + 'Ctrl.js'));

  //  this._updateAppJs(this.camelModuleName);
  }//,
/*
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
  }*/

});
