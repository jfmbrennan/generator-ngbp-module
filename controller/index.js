'use strict';
var path = require('path');
var util = require('util');
var fs = require('fs-extra');
var yeoman = require('yeoman-generator');
var esprima = require('esprima');
var escodegen = require('escodegen');

var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.argument('name', {type: String, required: true});
  this.existingModules = this.config.get('modules');
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askForModule = function askForModuleName() {
  var done = this.async();
  this.prompt({
      type: "list",
      name: "moduleName",
      message: "Select which module to place new controller",
      choices: this.existingModules
    }, function (props) {
    this.moduleName = props.moduleName;
    done();
  }.bind(this));
};

Generator.prototype.createController = function createController() {
  var modulePath = path.join(this.env.cwd, 'src', 'app', this.moduleName);
  this.filePath = path.join(modulePath, 'controllers');
  this.controllerName = this.name + 'Ctrl';
  this.template('controller.js', path.join(this.filePath, this.controllerName + '.js'));
};

Generator.prototype.updateControllerWireFile = function updateControllerWireFile() {
  var module, newFile;
  var fileName = path.join(this.filePath, this.moduleName + '.controllers.js');
  var file = this.readFileAsString(fileName);
  var start = file.indexOf('[');
  var end = file.indexOf(']');

  if (!file || start === -1 || end === -1) {
    return false;
  }

  var substr = file.substring(start, end + 1);
  var parsed = esprima.parse(substr);

  if (!this._.find(parsed.body[0].expression.elements, { 'value': this.controllerName })) {
    module = esprima.parse("'" + this.controllerName + "'");
    parsed.body[0].expression.elements.push(module.body[0].expression);
    newFile = file.slice(0, start) + escodegen.generate(parsed).slice(0, -1) + file.slice(end + 1);
    this.writeFileFromString(newFile, fileName);
  }
};
