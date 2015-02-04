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
  },

  askFor: function () {
    var done = this.async();

    var prompts = [
      {
        name: 'modulePath',
        message: 'Where is the location of this module?',
        default: 'app',
        when: function () {
          var modulePath = path.join(this.env.cwd, 'src', 'app', this.name);
          return !fs.existsSync(modulePath);
        }.bind(this),
        validate: function (input) {
          var modulePath = path.join(this.env.cwd, 'src', input, this.name);
          if (!fs.existsSync(modulePath)) {
            return "Cannot find the module '" + path.join(input, this.name) + "'";
          }
          return true;
        }.bind(this)
      }, {
        name: 'remove',
        message: 'Are you sure you want to remove ' + this.name + '?',
        type: 'confirm'
      }
    ];

    this.prompt(prompts, function (props) {
      var moduleRootPath = props.hasOwnProperty('modulePath') ? props.modulePath : 'app';
      this.modulePath = path.join(this.env.cwd, 'src', moduleRootPath, this.name);
      this.removeModule = props.remove;

      done();
    }.bind(this));
  },

  files: function () {
    fs.removeSync(this.modulePath);
    this._updateAppJs(this.name);
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
