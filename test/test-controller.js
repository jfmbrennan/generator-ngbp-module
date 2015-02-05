'use strict';

var path = require('path');
var fs = require('fs-extra');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('ngbp-module:controllers', function () {

  var runGen;

  beforeEach(function () {
    runGen = helpers
      .run(path.join(__dirname, '../controllers'))
      .inDir(path.join(__dirname, './temp'))
      .withOptions({ 'skip-install': true })
      .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']]);
  });

  it('create files', function (done) {
    runGen.withArguments(['newModule'])
      .withPrompt({
        modulePath: 'app'
      })
      .on('ready', function () {
        fs.ensureDirSync('./test/temp/src/app');
        fs.writeFileSync('./test/temp/src/app/app.js', "angular.module('test', ['existingModule', 'newModule'])");
      })
      .on('end', function () {
        assert.file([
          'test/temp/src/app/app.js'
        ]);
        assert.noFile([ 'test/temp/src/app/newModule/controllers/newModuleCtrl.js'
        ]);
        done();
      });
  });

});
