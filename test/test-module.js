'use strict';

var path = require('path');
var fs = require('fs-extra');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('ngbp-module:module', function () {

  var runGen;

  beforeEach(function () {
    runGen = helpers
      .run(path.join(__dirname, '../module'))
      .inDir(path.join(__dirname, './temp'))
      .withArguments(['newModule'])
      .withPrompt({
        modules: ['templates', 'uiRouter']
      })
      .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']]);
  });

  it('creates files', function (done) {
    runGen.withOptions({ 'skip-install': true })
      .on('ready', function () {
        fs.ensureDirSync('./test/temp/src/app');
        fs.writeFileSync('./test/temp/src/app/app.js', "angular.module('test', ['test.existingModule'])");
      })
      .on('end', function () {
        assert.file([
          'test/temp/src/app/app.js',
          'test/temp/src/app/newModule/newModule.module.js',
          'test/temp/src/app/newModule/controllers/newModule.controllers.js',
          'test/temp/src/app/newModule/directives/newModule.directives.js',
          'test/temp/src/app/newModule/filters/newModule.filters.js',
          'test/temp/src/app/newModule/services/newModule.services.js',
          'test/temp/src/app/newModule/unit/newModule.spec.js',
          'test/temp/src/app/newModule/e2e/newModule.e2e.js'
        ]);
        done();
      });
  });

  it('updates app.js', function (done) {
    runGen.withOptions({ 'skip-install': true })
      .on('ready', function () {
        fs.ensureDirSync('./test/temp/src/app');
        fs.writeFileSync('./test/temp/src/app/app.js', "angular.module('test', ['test.existingModule'])");
      })
      .on('end', function () {
        assert.fileContent('test/temp/src/app/app.js', "angular.module('test', [\n    'test.existingModule',\n    'test.newModule'\n])");
        done();
      });
  });

  it('does not update app.js if expected syntax cannot be found', function (done) {
    runGen.withOptions({ 'skip-install': true })
      .on('ready', function () {
        fs.ensureDirSync('./test/temp/src/app');
        fs.writeFileSync('./test/temp/src/app/app.js', "angular.module('test')");
      })
      .on('end', function () {
        assert.fileContent('test/temp/src/app/app.js', "angular.module('test')");
        done();
      });
  });

});
