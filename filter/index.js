'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');

var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.promptModuleName = function promptModuleName() {
  this.selectModuleFromConfig('filter');
};

Generator.prototype.createFilterFile = function createFilterFile() {
  this.createTemplateFile('filter.js', 'filters');
};

Generator.prototype.createFilterUnitTest = function createFilterUnitTest() {
  this.createUnitTest('.filter');
};
