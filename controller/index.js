'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');

var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.promptModuleName = function promptModuleName() {
  this.selectModuleFromConfig('controller');
};

Generator.prototype.createControllerFile = function createControllerFile() {
  this.createTemplateFile('controller.js', 'controllers', {suffix: 'Ctrl'});
};

Generator.prototype.createControllerUnitTest = function createControllerUnitTest() {
  this.createUnitTest('controller.js', 'controllers', {suffix: 'Ctrl'});
};
