'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.composeWithModule = function composeWithModule() {
  this.composeWith('ngbp-module:module', {
    args: this.args,
    options: this.options
  });
};
