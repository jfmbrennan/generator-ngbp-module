'use strict';

var path = require('path');
var fs = require('fs-extra');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('ngbp-module:build', function () {

  var runGen;

  beforeEach(function () {
    runGen = helpers
      .run(path.join(__dirname, '../build'))
      .inDir(path.join(__dirname, './temp'))
      .withArguments(['test'])
      .withPrompt({createProject: 'y'})
      .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']]);
  });

  it('creates project files', function (done) {
    runGen.on('end', function () {
      assert.file([
        'test/temp/bower.json'
      ]);
      done();
    });
  });

});
