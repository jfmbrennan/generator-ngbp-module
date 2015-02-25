'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');

var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.promptModuleName = function promptModuleName() {
  this.selectModuleFromConfig('service');
};

Generator.prototype.createFilter = function createFilter() {
  this.createTemplateFile('service.js', 'services');
};

Generator.prototype.createServiceUnitTest = function createServiceUnitTest() {
  this.createUnitTest('service.js', 'services');
};
