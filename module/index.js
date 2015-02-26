'use strict';
var path = require('path');
var util = require('util');
var fse = require('fs-extra');
var yeoman = require('yeoman-generator');
var esprima = require('esprima');
var escodegen = require('escodegen');

var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
  this.argument('moduleName', {type: String, required: true});
  this.camelModuleName = this._.camelize(this.moduleName);
  this.capitalModuleName = this._.capitalize(this.moduleName);
  this.lowerModuleName = this.moduleName.toLowerCase();
  this.modulePath = path.join(this.env.cwd, 'src', 'app', this.moduleName);
  this.projectName = this.config.get('name');
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askForModules = function askForModules() {
  var done = this.async();

  var prompts = [
    {
      type: "checkbox",
      name: "modules",
      message: "Please select module's dependencies?",
      choices: [{
        value: ['\'templates-app\'', '\'templates-common\''],
        name: 'Template Caching',
        checked: true
      }, {
        value: '\'ui.router\'',
        name: 'UI-Router',
        checked: true
      }, {
        value: '\'ngResource\'',
        name: 'Angular Resource',
        checked: false
      }, {
        value: '\'ngCookies\'',
        name: 'Angular Cookies',
        checked: false
      }]
    }
  ];

  this.prompt(prompts, function (props) {
    this.includeModules = this._.flatten(props.modules);
    done();
  }.bind(this));
};

Generator.prototype.writeModuleFiles = function writeModuleFiles() {

  this._createModuleFile('_module.controllers.js', 'controllers'); 
  this._createModuleFile('_module.directives.js', 'directives'); 
  this._createModuleFile('_module.filters.js', 'filters'); 
  this._createModuleFile('_module.services.js', 'services'); 
  this._createModuleFile('_module.spec.js', 'unit', {suffix: '.spec.js', include: false}); 
  this._createModuleFile('_module.e2e.js', 'e2e', {include: false}); 

  this.mkdir(path.join(this.modulePath, 'directives', 'partials'));
  this.mkdir(path.join(this.modulePath, 'assets'));
  this.mkdir(path.join(this.modulePath, 'styles'));

  this.moduleDependencies = '\n    ' + this.includeModules.join(',\n    ') + '\n  ';

  this._createModuleFile('_module.tpl.html', 'partials', {suffix: '.tpl.html', include: false}); 
  this._createModuleFile('_module.module.js', '.', {suffix: '.module.js', include: false}); 
};

Generator.prototype._createModuleFile = function _createModuleFile(src, dest, options) {
  options = this._.assign({
    suffix: '.' + dest + '.js',
    include: true
  }, options);

  var filePath = path.join(this.modulePath, dest);
  var source = path.join(dest, src);
  var destFileName = this.moduleName + options.suffix;
  var destination = path.join(filePath, destFileName);

  this.mkdir(filePath);
  this.template(source, destination);

  if (options.include) {
    this.includeModules.push('\'' + this.moduleName + '.' + dest + '\'');
  }
};

Generator.prototype.updateAppJs = function updateAppJs() {
  var module, newFile;
  var filePath = path.join(this.env.cwd, 'src', 'app', 'app.js');
  var file = this.readFileAsString(filePath);
  var startMarker = file.indexOf('.module(') + 8;
  var start = file.indexOf('[', startMarker);
  var end = file.indexOf(']', start);

  if (!file || start === -1 || end === -1) {
    return false;
  }

  var substr = file.substring(start, end + 1);
  var parsed = esprima.parse(substr);

  if (!this.projectName) {
    var endName = file.indexOf(',', startMarker);
    this.projectName = file.substring(startMarker + 1, endName - 1);
  }

  var moduleName = this.projectName + '.' + this.camelModuleName;

  if (!this._.find(parsed.body[0].expression.elements, { 'value': moduleName })) {
    module = esprima.parse("'" + moduleName + "'");
    parsed.body[0].expression.elements.push(module.body[0].expression);
    newFile = file.slice(0, start) + escodegen.generate(parsed).slice(0, -1) + file.slice(end + 1);
    this.writeFileFromString(newFile, filePath);
  }
};

Generator.prototype.updateConfig = function updateConfig() {
  var existingModules = this.config.get('modules') || [];
  existingModules.push(this.moduleName);
  this.config.set('modules', this._.uniq(existingModules));

  if (this.config.get('name') !== this.projectName) {
    this.config.set('name', this.projectName);
  }
};

