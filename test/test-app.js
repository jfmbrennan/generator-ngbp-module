'use strict';

var path = require('path');
var fs = require('fs-extra');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('ngbp-module:app', function () {

  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, './temp'))
      .withOptions({ 'skip-install': true })
      .withArguments(['newModule'])
      .withPrompt({
        rootFolder: 'app',
        modules: ['templates', 'uiRouter']
      })
      .on('ready', function () {
        fs.writeFileSync('./src/app/app.js', "angular.module('test', ['existingModule'])");
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'src/app/app.js',
      'src/app/newModule/newModule.module.js'
    ]);
  });
});
