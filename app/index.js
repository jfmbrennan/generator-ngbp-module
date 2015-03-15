'use strict';
var util = require('util');
var path = require('path');
var fs = require('fs-extra');
var yeoman = require('yeoman-generator');

var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
  var packageJsonExists = fs.existsSync(this.destinationPath('package.json'));

  this.option('init', {
    desc: 'Scaffold angular app',
    defaults: false,
    required: false
  });

  this.option('banner', {
    desc: 'Specify banner template file',
    type: String,
    defaults: false,
    required: false
  });

  this.initApp = this.options.init || !packageJsonExists;
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.initializeApp = function initializeApp() {
  if (this.initApp) {
    this.composeWith('ngbp-module:build', {
      args: this.args,
      options: this.options
    });
  }
};

Generator.prototype.composeWithModule = function composeWithModule() {
  if (!this.initApp) {
    this.composeWith('ngbp-module:module', {
      args: this.args,
      options: this.options
    });
  }
};
