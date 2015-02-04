'use strict';

var path = require('path');
var fs = require('fs-extra');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('ngbp-module:remove', function () {

  var runGen;

  beforeEach(function () {
    runGen = helpers
      .run(path.join(__dirname, '../remove'))
      .inDir(path.join(__dirname, './temp'))
      .withOptions({ 'skip-install': true })
      .withArguments(['newModule'])
      .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']]);
  });

  it('remove files', function (done) {
    runGen.withPrompt({
        remove: 'Y',
        modulePath: 'app'
      })
      .on('ready', function () {
        fs.ensureDirSync('./test/temp/src/app');
        fs.writeFileSync('./test/temp/src/app/app.js', "angular.module('test', ['existingModule', 'newModule'])");
        fs.ensureDirSync('./test/temp/src/app/newModule');
        fs.writeFileSync('./test/temp/src/app/newModule.module.js', "test file removal");
      })
      .on('end', function () {
        assert.file([
          'test/temp/src/app/app.js'
        ]);
        assert.noFile([
          'test/temp/src/app/newModule/newModule.module.js'
        ]);
        done();
      });
  });

  it('updates app.js', function (done) {
    runGen.withPrompt({
        remove: 'Y'
      })
      .on('ready', function () {
        fs.ensureDirSync('./test/temp/src/app');
        fs.writeFileSync('./test/temp/src/app/app.js', "angular.module('test', ['existingModule', 'newModule'])");
        fs.ensureDirSync('./test/temp/src/app/newModule');
        fs.writeFileSync('./test/temp/src/app/newModule.module.js', "test file removal");
      })
      .on('end', function () {
        assert.fileContent('test/temp/src/app/app.js', "angular.module('test', ['existingModule'])");
        done();
      });
  });

  it('does not update app.js if expected syntax cannot be found', function (done) {
    runGen.withPrompt({
        remove: 'Y'
      })
      .on('ready', function () {
        fs.ensureDirSync('./test/temp/src/app');
        fs.writeFileSync('./test/temp/src/app/app.js', "angular.module('test')");
        fs.ensureDirSync('./test/temp/src/app/newModule');
        fs.writeFileSync('./test/temp/src/app/newModule.module.js', "test file removal");
      })
      .on('end', function () {
        assert.fileContent('test/temp/src/app/app.js', "angular.module('test')");
        done();
      });
  });

  it('prompts user for module location', function (done) {
    runGen.withPrompt({
        remove: 'Y',
        modulePath: 'app/subapp'
      })
      .on('ready', function () {
        fs.ensureDirSync('./test/temp/src/app');
        fs.writeFileSync('./test/temp/src/app/app.js', "angular.module('test', ['existingModule', 'newModule'])");
        fs.ensureDirSync('./test/temp/src/app/subapp/newModule');
        fs.writeFileSync('./test/temp/src/app/subapp/newModule.module.js', "test file removal");
      })
      .on('end', function () {
        assert.file([
          'test/temp/src/app/app.js'
        ]);
        assert.noFile([
          'test/temp/src/app/subapp/newModule/newModule.module.js'
        ]);
        done();
      });
  });

});
