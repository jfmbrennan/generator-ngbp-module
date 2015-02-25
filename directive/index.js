'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');

var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.promptModuleName = function promptModuleName() {
  this.selectModuleFromConfig('directive');
};

Generator.prototype.createFilter = function createFilter() {
  this.createTemplateFile('directive.js', 'directives');
};

Generator.prototype.createDirectiveUnitTest = function createDirectiveUnitTest() {
  this.createUnitTest('directive.js', 'directives');
};
