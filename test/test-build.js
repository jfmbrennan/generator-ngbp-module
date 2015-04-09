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
      .withPrompts({createProject: 'y'})
      .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']]);
  });

  it('creates project files', function (done) {
    runGen.on('end', function () {
      assert.file([
        'test/temp/bower.json',
        'test/temp/Gruntfile.js',
        'test/temp/package.json',
        'test/temp/README.md',
        'test/temp/src/app/app.js',
        'test/temp/src/less/main.less'
      ]);
      done();
    });
  });

  it('accepts banner file as optional input', function (done) {

    runGen.withOptions({banner: 'banner.test'})
      .inDir(path.join(__dirname, './temp'), function (dir) {
        fs.writeFileSync(path.join(dir, 'banner.test'), "/**\n * Banner Test\n */");
      })
      .on('end', function () {
        assert.fileContent('.yo-rc.json', /\/\*\*\\n\s\*\sBanner\sTest\\n\s\*\//);
        done();
      });
  });

});
