/**
 * Created by dave on 2/9/15.
 */

describe('basic test', function () {

    var app = angular.module('WonderlandApp');
    var Stories;

    before(function () {
      injector(function (_Stories_) {
        Stories = _Stories_;
      });
    });
    
  it('should run tests', function () {

      console.log('stories: ', Stories);
  });

});


