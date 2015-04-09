'use strict';

var path = require('path');
var fs = require('fs-extra');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('ngbp-module:filter', function () {

  var runGen;

  beforeEach(function () {
    runGen = helpers
      .run(path.join(__dirname, '../filter'))
      .inDir(path.join(__dirname, './temp'))
      .withArguments(['Test'])
      .withPrompts({
        moduleName: 'newModule'
      })
      .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']]);
  });

  it('creates files', function (done) {
    runGen.withOptions({ 'skip-install': true })
      .on('ready', function () {
        fs.ensureDirSync('./test/temp/src/app/newModule/filters');
        fs.writeFileSync('./test/temp/src/app/newModule/filters/newModule.filters.js', "angular.module('newModule.filters', ['newModule.filters.Existing'])");
      })
      .on('end', function () {
        assert.file([
          'test/temp/src/app/newModule/filters/Test.js'
        ]);
        done();
      });
  });

  it('updates filters.js', function (done) {
    runGen.withOptions({ 'skip-install': true })
      .on('ready', function () {
        fs.ensureDirSync('./test/temp/src/app/newModule/filters');
        fs.writeFileSync('./test/temp/src/app/newModule/filters/newModule.filters.js', "angular.module('newModule.filters', ['newModule.filters.Existing'])");
      })
      .on('end', function () {
        assert.fileContent('test/temp/src/app/newModule/filters/newModule.filters.js', "angular.module('newModule.filters', [\n    'newModule.filters.Existing',\n    'newModule.filters.Test'\n])");
        done();
      });
  });

  it('does not update app.js if expected syntax cannot be found', function (done) {
    runGen.withOptions({ 'skip-install': true })
      .on('ready', function () {
        fs.ensureDirSync('./test/temp/src/app/newModule/filters');
        fs.writeFileSync('./test/temp/src/app/newModule/filters/newModule.filters.js', "angular.module('test')");
      })
      .on('end', function () {
        assert.fileContent('test/temp/src/app/newModule/filters/newModule.filters.js', "angular.module('test')");
        done();
      });
  });

});
