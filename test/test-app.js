'use strict';

var path = require('path');
var fs = require('fs-extra');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('ngbp-module:app', function () {

  var runGen;

  beforeEach(function () {
    runGen = helpers
      .run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, './temp'))
      .withArguments(['newModule'])
      .withPrompt({
        rootFolder: 'app',
        modules: ['templates', 'uiRouter']
      })
      .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']]);
  });

  it('creates files', function (done) {
    runGen.withOptions({ 'skip-install': true })
      .on('end', function () {
        assert.file([
          'src/app/app.js',
          'src/app/newModule/newModule.module.js'
        ])
      });
    done();
  });

/*  it('updates app.js', function (done) {
    runGen.withOptions({ 'skip-install': true })
      .on('ready', function () {
        fs.writeFileSync('./test/temp/src/app/app.js', "angular.module('test', ['existingModule'])");
      })
      .on('end', function () {
        assert.fileContent('src/app/app.js', "angular.module('test', [\n    'existingModule',\n    'newModule'\n])");
      });
    done();
  });*/

});
