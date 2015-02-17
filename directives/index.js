'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');

var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.writeDirectiveFiles = function writeDirectiveFiles() {
  this.createTemplateFile('_module.directives.js', '.directives.js', 'directives'); 
};
