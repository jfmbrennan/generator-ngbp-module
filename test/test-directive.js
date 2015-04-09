'use strict';

var path = require('path');
var fs = require('fs-extra');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('ngbp-module:directive', function () {

  var runGen;

  beforeEach(function () {
    runGen = helpers
      .run(path.join(__dirname, '../directive'))
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
        fs.ensureDirSync('./test/temp/src/app/newModule/directives');
        fs.writeFileSync('./test/temp/src/app/newModule/directives/newModule.directives.js', "angular.module('newModule.directives', ['newModule.directives.Existing'])");
      })
      .on('end', function () {
        assert.file([
          'test/temp/src/app/newModule/directives/Test.js'
        ]);
        done();
      });
  });

  it('updates directives.js', function (done) {
    runGen.withOptions({ 'skip-install': true })
      .on('ready', function () {
        fs.ensureDirSync('./test/temp/src/app/newModule/directives');
        fs.writeFileSync('./test/temp/src/app/newModule/directives/newModule.directives.js', "angular.module('newModule.directives', ['newModule.directives.Existing'])");
      })
      .on('end', function () {
        assert.fileContent('test/temp/src/app/newModule/directives/newModule.directives.js', "angular.module('newModule.directives', [\n    'newModule.directives.Existing',\n    'newModule.directives.Test'\n])");
        done();
      });
  });

  it('does not update app.js if expected syntax cannot be found', function (done) {
    runGen.withOptions({ 'skip-install': true })
      .on('ready', function () {
        fs.ensureDirSync('./test/temp/src/app/newModule/directives');
        fs.writeFileSync('./test/temp/src/app/newModule/directives/newModule.directives.js', "angular.module('test')");
      })
      .on('end', function () {
        assert.fileContent('test/temp/src/app/newModule/directives/newModule.directives.js', "angular.module('test')");
        done();
      });
  });

});
