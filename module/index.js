'use strict';
var path = require('path');
var util = require('util');
var fse = require('fs-extra');
var yeoman = require('yeoman-generator');
var esprima = require('esprima');
var escodegen = require('escodegen');

var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
  this.moduleName = this.args[0];
  this.camelModuleName = this._.camelize(this.moduleName);
  this.capitalModuleName = this._.capitalize(this.moduleName);
  this.lowerModuleName = this.moduleName.toLowerCase();
  this.modulePath = path.join(this.env.cwd, 'src', 'app', this.moduleName);
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

Generator.prototype.askForScaffolding = function askForScaffolding() {
  var done = this.async();

  var prompts = [
    {
      type: "checkbox",
      name: "scaffold",
      message: "Do you want to scaffold all of the following?",
      choices: [{
        value: 'controllers',
        name: 'Controllers',
        checked: true
      }, {
        value: 'directives',
        name: 'Directives',
        checked: true
      }, {
        value: 'filters',
        name: 'Filters',
        checked: true
      }, {
        value: 'services',
        name: 'Services',
        checked: true
      }, {
        value: 'unit',
        name: 'Unit Tests',
        checked: true
      }, {
        value: 'e2e',
        name: 'E2E Tests',
        checked: true
      }, {
        value: 'assets',
        name: 'Image Assets',
        checked: true
      }, {
        value: 'styles',
        name: 'CSS',
        checked: true
      }]
    }
  ];

  this.prompt(prompts, function (props) {

    var includeScaffold = function (choice) { 
      return props.scaffold.indexOf(choice) !== -1; 
    };

    this.scaffoldController = includeScaffold('controllers');
    this.scaffoldDirective = includeScaffold('directives');
    this.scaffoldFilter = includeScaffold('filters');
    this.scaffoldService = includeScaffold('services');
    this.scaffoldUnitTest = includeScaffold('unit');
    this.scaffoldE2eTest = includeScaffold('e2e');
    this.scaffoldAssets = includeScaffold('assets');
    this.scaffoldStyles = includeScaffold('styles');

    done();
  }.bind(this));
};

Generator.prototype.writeModuleFiles = function writeModuleFiles() {

  if (this.scaffoldController) {
    var controllerTemplate = this._createTemplateFile(
      '_module.controllers.js',
      '.controllers.js',
      'controllers'
    ); 
    this.includeModules.push('\'' + controllerTemplate + '\'');
  }

  if (this.scaffoldDirective) {
    var directiveTemplate = this._createTemplateFile(
      '_module.directives.js',
      '.directives.js',
      'directives'
    ); 
    this.includeModules.push('\'' + directiveTemplate + '\'');
    this.mkdir(path.join(this.modulePath, 'directives', 'partials'));
  }

  if (this.scaffoldFilter) {
    var filterTemplate = this._createTemplateFile(
      '_module.filters.js',
      '.filters.js',
      'filters'
    ); 
    this.includeModules.push('\'' + filterTemplate + '\'');
  }

  if (this.scaffoldService) {
    var serviceTemplate = this._createTemplateFile(
      '_module.services.js',
      '.services.js',
      'services'
    ); 
    this.includeModules.push('\'' + serviceTemplate + '\'');
  }

  if (this.scaffoldUnitTest) {
    this._createTemplateFile(
      '_module.spec.js',
      '.spec.js',
      'unit'
    ); 
  }

  if (this.scaffoldE2eTest) {
    this._createTemplateFile(
      '_module.e2e.js',
      '.e2e.js',
      'e2e'
    ); 
  }

  if (this.scaffoldAssets) {
    this.mkdir(path.join(this.modulePath, 'assets'));
  }

  if (this.scaffoldStyles) {
    this.mkdir(path.join(this.modulePath, 'styles'));
  }

  if (this.includeModules.length) {
    this.moduleDependencies = '\n    ' + this.includeModules.join(',\n    ') + '\n  ';
  }

  this._createTemplateFile(
    '_module.tpl.html',
    '.tpl.html',
    'partials'
  ); 

  this._createTemplateFile(
    '_module.module.js',
    '.module.js'
  ); 

  this._updateAppJs(this.camelModuleName);
};

Generator.prototype._createTemplateFile = function _createTemplateFile(src, destSuffix, templatePath) {
  templatePath = templatePath || '.';
  var filePath = path.join(this.modulePath, templatePath);
  var source = path.join(templatePath, src);
  var destFileName = this.moduleName + destSuffix;
  var destination = path.join(filePath, destFileName);

  this.mkdir(filePath);
  this.template(source, destination);
  return destFileName;
};

Generator.prototype._updateAppJs = function _updateAppJs(camelModuleName) {
  var module, newFile;
  var filePath = path.join(this.env.cwd, 'src', 'app', 'app.js');
  var file = this.readFileAsString(filePath);
  var start = file.indexOf('[');
  var end = file.indexOf(']');

  if (!file || start === -1 || end === -1) {
    return false;
  }

  var substr = file.substring(start, end + 1);
  var parsed = esprima.parse(substr);

  if (!this._.find(parsed.body[0].expression.elements, { 'value': camelModuleName })) {
    module = esprima.parse("'" + camelModuleName + "'");
    parsed.body[0].expression.elements.push(module.body[0].expression);
    newFile = file.slice(0, start) + escodegen.generate(parsed).slice(0, -1) + file.slice(end + 1);
    this.writeFileFromString(newFile, filePath);
  }
};
