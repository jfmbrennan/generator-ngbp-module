'use strict';

var path = require('path');
var fs = require('fs-extra');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('ngbp-module:controller', function () {

  var runGen;

  beforeEach(function () {
    runGen = helpers
      .run(path.join(__dirname, '../controller'))
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
        fs.ensureDirSync('./test/temp/src/app/newModule/controllers');
        fs.writeFileSync('./test/temp/src/app/newModule/controllers/newModule.controllers.js', "angular.module('newModule.controllers', ['newModule.controllers.ExistingCtrl'])");
      })
      .on('end', function () {
        assert.file([
          'test/temp/src/app/newModule/controllers/TestCtrl.js'
        ]);
        done();
      });
  });

  it('updates controllers.js', function (done) {
    runGen.withOptions({ 'skip-install': true })
      .on('ready', function () {
        fs.ensureDirSync('./test/temp/src/app/newModule/controllers');
        fs.writeFileSync('./test/temp/src/app/newModule/controllers/newModule.controllers.js', "angular.module('newModule.controllers', ['newModule.controllers.ExistingCtrl'])");
      })
      .on('end', function () {
        assert.fileContent('test/temp/src/app/newModule/controllers/newModule.controllers.js', "angular.module('newModule.controllers', [\n    'newModule.controllers.ExistingCtrl',\n    'newModule.controllers.TestCtrl'\n])");
        done();
      });
  });

  it('does not update app.js if expected syntax cannot be found', function (done) {
    runGen.withOptions({ 'skip-install': true })
      .on('ready', function () {
        fs.ensureDirSync('./test/temp/src/app/newModule/controllers');
        fs.writeFileSync('./test/temp/src/app/newModule/controllers/newModule.controllers.js', "angular.module('test')");
      })
      .on('end', function () {
        assert.fileContent('test/temp/src/app/newModule/controllers/newModule.controllers.js', "angular.module('test')");
        done();
      });
  });

});
