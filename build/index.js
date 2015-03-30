'use strict';
var util = require('util');
var path = require('path');
var chalk = require('chalk');
var format = require('dateformat');
var yeoman = require('yeoman-generator');

var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
  this.argument('appname', {type: String, required: false});
  this.appname = this.appname || path.basename(process.cwd());
  this.initApp = options.init;
  this.skipInstall = options['skip-install'] || false;
  this.banner = options.banner ?
    this.readFileAsString(path.join(this.env.cwd, options.banner)) : '';
  this.date = format(new Date(), 'dS mmmm yyyy');
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askForModules = function askForModules() {
  if (!this.initApp) {
    var done = this.async();

    var prompts = {
      type: 'confirm',
      name: 'createProject',
      message: 'Cannot find package.json. Do you want to scaffold a new app?'
    };

    this.prompt(prompts, function (props) {
      this.initApp = props.createProject;
      done();
    }.bind(this));
  }
};


Generator.prototype.writeAppFiles = function writeAppFiles() {
  if (this.initApp) {

    var files = this.expandFiles('**', { dot: true, cwd: this.templatePath() });

    for (var i = 0; i < files.length; i++) {
      var dest;
      var f = files[i];
      var src = path.join(this.templatePath(), f);
      if (path.basename(f).indexOf('_') === 0) {
          dest = path.join(this.env.cwd, path.dirname(f), path.basename(f).replace(/^_/, ''));
          this.template(src, dest);
      } else {
          dest = path.join(this.env.cwd, f);
          this.copy(src, dest);
      }
    }
  }
};

Generator.prototype.updateConfig = function updateConfig() {
  if (this.initApp) {
    this.config.set('name', this.appname);
    this.config.set('banner', this.banner);
  }
};

Generator.prototype.installDeps = function installDeps() {
  this.installDependencies({
    skipInstall: this.skipInstall,
    callback: function () {
      var message = '\n\nAlthough you have created a new app, it still won\'t do much.\nThe next step is to ';
      message += chalk.bold.yellow('yo ngbp-module <modulename>');  
      message += ' to create a usable ngbp module';
      console.log(message);
    }
  });
};
