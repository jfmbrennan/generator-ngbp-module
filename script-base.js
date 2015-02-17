'use strict';
var path = require('path');
var util = require('util');
var fs = require('fs-extra');
var yeoman = require('yeoman-generator');
//var esprima = require('esprima');
//var escodegen = require('escodegen');

var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.argument('name', {type: String, required: false});

  this.moduleName = this.args.length ? this.args[0] : '';

  this.capitalModuleName = this._.capitalize(this.moduleName);
  this.camelModuleName = this._.camelize(this.moduleName);
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askForModuleName = function askForModuleName() {
  if (this.moduleName === '') {
    var done = this.async();
    this.prompt({
        type: "input",
        name: "name",
        message: "Please enter module name",
      }, function (props) {
      this.moduleName = props.name;
      this.capitalModuleName = this._.capitalize(this.moduleName);
      this.camelModuleName = this._.camelize(this.moduleName);
      done();
    }.bind(this));
  }
};

Generator.prototype.createTemplateFile = function (src, destSuffix, targetPath) {
  var modulePath = path.join(this.env.cwd, 'src', 'app', this.moduleName);
  var filePath = path.join(modulePath, targetPath);
  this.mkdir(filePath);
  this.template(src, path.join(filePath, this.moduleName + destSuffix));
};
