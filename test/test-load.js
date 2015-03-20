/*global describe, beforeEach, it*/
'use strict';
var assert = require('yeoman-generator').assert;

describe('ngbp module', function () {
  it('can be imported without blowing up', function () {
    var app = require('../app');
    assert(app !== undefined);
  });

  it('can load module sub-generator', function () {
    var module = require('../module');
    assert(module !== undefined);
  });

  it('can load controller sub-generator', function () {
    var controller = require('../controller');
    assert(controller !== undefined);
  });

  it('can load directive sub-generator', function () {
    var directive = require('../directive');
    assert(directive !== undefined);
  });

  it('can load filter sub-generator', function () {
    var filter = require('../filter');
    assert(filter !== undefined);
  });

  it('can load service sub-generator', function () {
    var service = require('../service');
    assert(service !== undefined);
  });

  it('can load remove sub-generator', function () {
    var remove = require('../remove');
    assert(remove !== undefined);
  });
});
