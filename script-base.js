'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var esprima = require('esprima');
var escodegen = require('escodegen');

var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.argument('name', {type: String, required: true});
  this.capitalName = this._.capitalize(this.name);
  this.existingModules = this.config.get('modules');
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.selectModuleFromConfig = function (type) {
  var done = this.async();
  this.prompt({
    type: 'list',
    name: 'moduleName',
    message: 'Select which module to place new ' + type,
    choices: this.existingModules
  }, function (props) {
    this.moduleName = props.moduleName;
    this.modulePath = path.join(this.env.cwd, 'src', 'app', this.moduleName);
    done();
  }.bind(this));
};

Generator.prototype.createTemplateFile = function (source, destination, options) {
  options = this._.assign({
    fileExt: '.js',
    suffix: '',
    skipAdd: false,
    namespace: '.' + destination + '.',
    wirefile: '.' + destination + '.js'
  }, options);

  this.filename = this.capitalName + options.suffix;
  this.namespace = this.moduleName + options.namespace + this.filename;

  var destfile = path.join(this.modulePath, destination, this.filename + options.fileExt);

  this.template(source, destfile);

  if (!options.skipAdd) {
    this.addModuleToWireFile(destination, this.moduleName + options.wirefile);
  }
};

Generator.prototype.addModuleToWireFile = function (destination, filename) {
  var module, newFile, substr, parsed;
  var filepath = path.join(this.modulePath, destination, filename);
  var file = this.readFileAsString(filepath);
  var start = file.indexOf('[');
  var end = file.indexOf(']');

  if (!file || start === -1 || end === -1) {
    return false;
  }

  substr = file.substring(start, end + 1);
  parsed = esprima.parse(substr);

  if (!this._.find(parsed.body[0].expression.elements, { 'value': this.namespace })) {
    module = esprima.parse('\'' + this.namespace + '\'');
    parsed.body[0].expression.elements.push(module.body[0].expression);
    newFile = file.slice(0, start) + escodegen.generate(parsed).slice(0, -1) + file.slice(end + 1);
    this.writeFileFromString(newFile, filepath);
  }
};

Generator.prototype.createUnitTest = function () {
  var unitFilename = this.filename + '.spec.js';
  var unitFilepath = path.join(this.modulePath, 'unit', unitFilename);
  this.template('unit.js', unitFilepath);
};
