/*global describe, beforeEach, it*/
'use strict';
var assert = require('yeoman-generator').assert;

describe('ngbp module', function () {
  it('can be imported without blowing up', function () {
    var app = require('../app');
    assert(app !== undefined);
  });

  it('can load remove sub-generator', function () {
    var remove = require('../remove');
    assert(remove !== undefined);
  });

  it('can load controllers sub-generator', function () {
    var controllers = require('../controllers');
    assert(controllers !== undefined);
  });

  it('can load filters sub-generator', function () {
    var filters = require('../filters');
    assert(filters !== undefined);
  });

  it('can load directives sub-generator', function () {
    var directives = require('../directives');
    assert(directives !== undefined);
  });

  it('can load services sub-generator', function () {
    var services = require('../services');
    assert(services !== undefined);
  });
});
