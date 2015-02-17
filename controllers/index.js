'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');

var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.writeControllerFiles = function writeControllerFiles() {
  this.createTemplateFile('_module.controllers.js', '.controllers.js', 'controllers'); 
};

//,

//  this._updateAppJs(this.camelModuleName);
//  this._updateAppJs(this.camelModuleName);
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
