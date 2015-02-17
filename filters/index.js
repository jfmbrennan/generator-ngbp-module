'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');

var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.writeFilterFiles = function writeFilterFiles() {
  this.createTemplateFile('_module.filters.js', '.filters.js', 'filters'); 
};
