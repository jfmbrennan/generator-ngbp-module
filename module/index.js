'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var esprima = require('esprima');
var escodegen = require('escodegen');

var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
  this.moduleName = this.args[0];
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
      }]
    }
  ];

  this.prompt(prompts, function (props) {
    this.moduleScaffolds = this._.flatten(props.scaffold);
    done();
  }.bind(this));
};

Generator.prototype.writeModuleFiles = function writeModuleFiles() {
  this._.forEach(this.moduleScaffolds, function (scaffold) {
    this.composeWith('ngbp-module:' + scaffold, {
      args: this.args,
      options: this.options
    });
    this.includeModules.push('\'' + this.moduleName + '.' + scaffold + '.js\'');
  }.bind(this));

  if (this.includeModules.length) {
    this.moduleDependencies = '\n    ' + this.includeModules.join(',\n    ') + '\n  ';
  }


  this.camelModuleName = this._.camelize(this.moduleName);
  this.capitalModuleName = this._.capitalize(this.moduleName);
  this.lowerModuleName = this.moduleName.toLowerCase();
  var modulePath = path.join(this.env.cwd, 'src', 'app', this.camelModuleName);
  var viewPath = path.join(modulePath, 'partials');

  this.mkdir(modulePath);
  this.mkdir(viewPath);

  this.template("_module.module.js", path.join(modulePath, this.camelModuleName + '.module.js'));
  this.template('_module.tpl.html', path.join(viewPath, this.camelModuleName + '.tpl.html'));

//  this._processDirectory('module', '');
  this._updateAppJs(this.camelModuleName);
};

  /*
  _processDirectory: function (source, destination) {
    var root = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);
    var files = this.expandFiles('**', { dot: true, cwd: root });

    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      var src = path.join(root, f);
      if (path.basename(f).indexOf('_') == 0) {
        var dest = path.join(destination, path.dirname(f), path.basename(f).replace(/^_/, ''));
        this.template(src, dest);
      }
      else {
        var dest = path.join(destination, f);
        this.copy(src, dest);
      }
    }
  },*/

Generator.prototype._updateAppJs = function _updateAppJs(camelModuleName) {
  var filePath = path.join(this.env.cwd, 'src', 'app', 'app.js');
  var file = this.readFileAsString(filePath);
  var start = file.indexOf('[');
  var end = file.indexOf(']');

  if (!file || start === -1 || end === -1) {
    return false;
  }

  var substr = file.substring(start, end + 1);
  var parsed = esprima.parse(substr);
  var module = esprima.parse("'" + camelModuleName + "'");
  parsed.body[0].expression.elements.push(module.body[0].expression);
  var newFile = file.slice(0, start) + escodegen.generate(parsed).slice(0, -1) + file.slice(end + 1);
  this.writeFileFromString(newFile, filePath);
};
