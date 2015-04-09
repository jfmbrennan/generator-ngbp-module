'use strict';
var _ = require('lodash');
var path = require('path');
var util = require('util');
var chalk = require('chalk');
var fse = require('fs-extra');
var mkdirp = require('mkdirp');
var wiring = require('html-wiring');
var yeoman = require('yeoman-generator');
var esprima = require('esprima');
var escodegen = require('escodegen');

var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.argument('moduleName', {type: String, required: true});
  this.camelModuleName = _.camelCase(this.moduleName);
  this.capitalModuleName = _.capitalize(this.moduleName);
  this.kebabModuleName = _.kebabCase(this.moduleName);
  this.lowerModuleName = this.moduleName.toLowerCase();
  this.modulePath = path.join(this.env.cwd, 'src', 'app', this.moduleName);
  this.projectName = this.config.get('name');
  this.appModuleName = this.projectName + '.' + this.camelModuleName;

  this.on('end', function () {
    var message = '\nTest out the module by running ';
    message += chalk.bold.yellow('grunt watch');
    message += ' in the console.\nBrowse to ';
    message += chalk.bold.cyan('http://localhost:9000/#/' + this.moduleName);
    message += ' to view the newly created module.';
    this.log(message);
  });
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askForModules = function askForModules() {
  var done = this.async();

  var prompts = [
    {
      type: 'checkbox',
      name: 'modules',
      message: 'Please select module\'s dependencies?',
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
    this.includeModules = _.flatten(props.modules);
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
  this._createModuleFile('_module.less', 'styles', {suffix: '.less', include: false});
  this._createModuleFile('_module.tpl.html', 'partials', {suffix: '.tpl.html', include: false});

  mkdirp.sync(path.join(this.modulePath, 'directives', 'partials'));
  mkdirp.sync(path.join(this.modulePath, 'assets'));
};

Generator.prototype.updateAppJs = function updateAppJs() {
  var module, newFile, substr, parsed, endName;
  var filePath = path.join(this.env.cwd, 'src', 'app', 'app.js');
  var file = wiring.readFileAsString(filePath);
  var startMarker = file.indexOf('.module(') + 8;
  var start = file.indexOf('[', startMarker);
  var end = file.indexOf(']', start);

  if (!file || start === -1 || end === -1) {
    return false;
  }

  substr = file.substring(start, end + 1);
  parsed = esprima.parse(substr);

  if (!this.projectName) {
    endName = file.indexOf(',', startMarker);
    this.projectName = file.substring(startMarker + 1, endName - 1);
    this.appModuleName = this.projectName + '.' + this.camelModuleName;
  }

  if (!_.find(parsed.body[0].expression.elements, { 'value': this.appModuleName })) {
    module = esprima.parse('"' + this.appModuleName + '"');
    parsed.body[0].expression.elements.push(module.body[0].expression);
    newFile = file.slice(0, start) + escodegen.generate(parsed).slice(0, -1) + file.slice(end + 1);
    wiring.writeFileFromString(newFile, filePath);
  }
};

Generator.prototype.createModuleJs = function createModuleJs() {
  this.moduleDependencies = '\n    ' + this.includeModules.join(',\n    ') + '\n  ';
  this._createModuleFile('_module.module.js', '.', {suffix: '.module.js', include: false}); 
};

Generator.prototype.updateMainLess = function updateMainLess() {
  var filePath = path.join(this.env.cwd, 'src', 'less', 'main.less');
  var lessPath = path.join('..', 'app', this.moduleName, 'styles', this.moduleName + '.less');
  var includeLess = '@import "' + lessPath + '";\n';
  fse.appendFileSync(filePath, includeLess);
};

Generator.prototype.updateConfig = function updateConfig() {
  var existingModules = this.config.get('modules') || [];
  existingModules.push(this.moduleName);
  this.config.set('modules', _.uniq(existingModules));

  if (this.config.get('name') !== this.projectName) {
    this.config.set('name', this.projectName);
  }
};

Generator.prototype._createModuleFile = function _createModuleFile(src, dest, options) {
  options = _.assign({
    suffix: '.' + dest + '.js',
    include: true
  }, options);

  var filePath = path.join(this.modulePath, dest);
  var source = path.join(dest, src);
  var destFileName = this.moduleName + options.suffix;
  var destination = path.join(filePath, destFileName);

  mkdirp.sync(filePath);
  this.template(source, destination);

  if (options.include) {
    this.includeModules.push('\'' + this.moduleName + '.' + dest + '\'');
  }
};
