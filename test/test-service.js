'use strict';

var path = require('path');
var fs = require('fs-extra');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('ngbp-module:service', function () {

  var runGen;

  beforeEach(function () {
    runGen = helpers
      .run(path.join(__dirname, '../service'))
      .inDir(path.join(__dirname, './temp'))
      .withArguments(['Test'])
      .withPrompt({
        moduleName: 'newModule'
      })
      .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']]);
  });

  it('creates files', function (done) {
    runGen.withOptions({ 'skip-install': true })
      .on('ready', function () {
        fs.ensureDirSync('./test/temp/src/app/newModule/services');
        fs.writeFileSync('./test/temp/src/app/newModule/services/newModule.services.js', "angular.module('newModule.services', ['newModule.services.Existing'])");
      })
      .on('end', function () {
        assert.file([
          'test/temp/src/app/newModule/services/Test.js'
        ]);
        done();
      });
  });

  it('updates services.js', function (done) {
    runGen.withOptions({ 'skip-install': true })
      .on('ready', function () {
        fs.ensureDirSync('./test/temp/src/app/newModule/services');
        fs.writeFileSync('./test/temp/src/app/newModule/services/newModule.services.js', "angular.module('newModule.services', ['newModule.services.Existing'])");
      })
      .on('end', function () {
        assert.fileContent('test/temp/src/app/newModule/services/newModule.services.js', "angular.module('newModule.services', [\n    'newModule.services.Existing',\n    'newModule.services.Test'\n])");
        done();
      });
  });

  it('does not update app.js if expected syntax cannot be found', function (done) {
    runGen.withOptions({ 'skip-install': true })
      .on('ready', function () {
        fs.ensureDirSync('./test/temp/src/app/newModule/services');
        fs.writeFileSync('./test/temp/src/app/newModule/services/newModule.services.js', "angular.module('test')");
      })
      .on('end', function () {
        assert.fileContent('test/temp/src/app/newModule/services/newModule.services.js', "angular.module('test')");
        done();
      });
  });

});
