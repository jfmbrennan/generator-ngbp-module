'use strict';
var fs = require('fs-extra');
var path = require('path');
var touch = require("touch");
var yeoman = require('yeoman-generator');
var esprima = require('esprima');
var escodegen = require('escodegen');

module.exports = yeoman.generators.NamedBase.extend({

  init: function () {
    var pkg = this.fs.readJSON('package.json', {name: 'projectName'});
    this.projectName = pkg.name;

    this.camelModuleName = this._.camelize(this.name);
    this.modulePath = path.join(this.env.cwd, 'src', 'app', this.camelModuleName);
    this.moduleFound = fs.existsSync(this.modulePath);
  },

  askFor: function () {
    var done = this.async();

    var prompts = [
      {
        name: 'remove',
        message: 'Are you sure you want to remove ' + this.name + '?',
        type: 'confirm'
      }
    ];

    if (!this.moduleFound) {
      prompts.unshift({
        name: 'modulePath',
        message: 'Where do you want to place this module?',
        default: 'app'
      });
    }

    this.prompt(prompts, function (props) {
      if (props.hasOwnProperty('modulePath')) {
        this.modulePath = path.join(this.env.cwd, 'src', props.modulePath);
        if (!fs.existsSync(this.modulePath)) {
          console.log("error");
        }
      }
      this.removeModule = props.remove;

      done();
    }.bind(this));
  },

  files: function () {
    fs.removeSync(this.modulePath);

    this._updateAppJs(this.camelModuleName);
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

    this._.remove(parsed.body[0].expression.elements, function (val) {
      return this.isEqual(val, module.body[0].expression);
    }, this._);

    var newFile = file.slice(0, start) + escodegen.generate(parsed).slice(0, -1) + file.slice(end + 1);
    this.writeFileFromString(newFile, filePath);
  }

});
