'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');

var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.writeServiceFiles = function writeServiceFiles() {
  this.createTemplateFile('_module.services.js', '.services.js', 'services'); 
};
