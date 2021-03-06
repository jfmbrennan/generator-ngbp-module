'use strict';
var _ = require('lodash');
var fs = require('fs-extra');
var path = require('path');
var wiring = require('html-wiring');
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
      name: 'remove',
      message: 'Are you sure you want to remove ' + this.name + '?',
      type: 'confirm'
    });

    this.prompt(prompts, function (props) {
      this.modulePath = getModulePath(props.modulePath);
      this.removeModule = props.remove;
      done();
    }.bind(this));
  },

  files: function () {
    if (this.removeModule) {
      fs.removeSync(this.modulePath);
      this._updateAppJs(this.name);
    }
  },

  _updateAppJs: function (camelModuleName) {
    var filePath = path.join(this.env.cwd, 'src', 'app', 'app.js');
    var file = wiring.readFileAsString(filePath);
    var start = file.indexOf('[');
    var end = file.indexOf(']');

    if (!file || start === -1 || end === -1) {
      return false;
    }

    var substr = file.substring(start, end + 1);
    var parsed = esprima.parse(substr);
    var module = esprima.parse('\'' + camelModuleName + '\'');

    _.remove(parsed.body[0].expression.elements, function (val) {
      return this.isEqual(val, module.body[0].expression);
    }, _);

    var newFile = file.slice(0, start) + escodegen.generate(parsed).slice(0, -1) + file.slice(end + 1);
    wiring.writeFileFromString(newFile, filePath);
  }

});
