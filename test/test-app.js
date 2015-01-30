'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('ngbp-module:app', function () {
  console.log(os.tmpdir(), './temp-test');
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({ 'skip-install': true })
      .withArguments(['testModule'])
      .withPrompt({
        rootFolder: 'app',
        modules: ['templates', 'uiRouter']
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'src/app/testModule/testModule.module.js'
    ]);
  });
});
