/**
 * Created by dave on 2/9/15.
 */

describe('basic test', function () {
  var $injector = angular.injector();
  var app = angular.module('WonderlandApp');
  var Stories;
  var assert = chai.assert;

  before(function () {
    Stories = angular.injector(['WonderlandApp']).get('Stories');
  });

  afterEach(function(){
    Stories.observer.clear();
  });

  it('should be able to observe any changes', function () {
    var updates = 0;
    Stories.observer.watch(function () {
      ++updates;
    });

    Stories.observer.broadcast([{id: 1}, {id: 2}], 'update');
    assert.equal(updates, 1, 'update watched');
  });

  it('should be able to observe specific changes', function () {
    var updates = 0;
    Stories.observer.watch(function () {
      ++updates;
    }, '*', 'update');

    Stories.observer.broadcast([{id: 1}, {id: 2}], 'update');
    assert.equal(updates, 1, 'update watched');
  });

  it('should be able to observe specific records', function () {
    var updates = 0;
    Stories.observer.watch(function () {
      ++updates;
    }, [1], 'update');

    Stories.observer.broadcast([{id: 1}, {id: 2}], 'update');
    assert.equal(updates, 1, 'record 1 watched');
    Stories.observer.broadcast([{id:3}], 'update');
    assert.equal(updates, 1, 'record 3 not watched');
  });

  it('should not throw false positives', function () {
    var updates = 0;
    Stories.observer.watch(function () {
      ++updates;
    }, '*', 'update');

    Stories.observer.broadcast([{id: 1}, {id: 2}], 'delete');
    assert.equal(updates, 0, 'update not updated');
  });

  it('should be able to have a very specific record state', function(){
    var updates = 0;
    Stories.observer.watch(function () {
      ++updates;
    }, [1], 'update');

    Stories.observer.broadcast([{id: 1}], 'delete');
    assert.equal(updates, 0, 'update not updated');

    Stories.observer.broadcast([{id: 2}], 'update');
    assert.equal(updates, 0, 'update not updated');

    Stories.observer.broadcast([{id: 1}], 'update');
    assert.equal(updates, 1, 'update updated');

  })

});


