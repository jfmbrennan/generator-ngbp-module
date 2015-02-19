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
});
