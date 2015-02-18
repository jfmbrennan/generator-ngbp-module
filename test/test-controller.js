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
      .on('end', function () {
        assert.file([
          'test/temp/src/app/newModule/controllers/newModule.controllers.js'
        ]);
        done();
      });
  });

});
