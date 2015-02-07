var wonderlandApp = angular.module('WonderlandApp',
  ['ngResource', 'ngSanitize', 'ui.grid', 'ui.grid.selection', 'ui.bootstrap'])
  .factory('Stories', ['$resource', function($resource){

  var Stories = $resource('/stories/:id', {id: '@id'}, {});

  return Stories;
}])
.factory('Accounts', ['$resource', function($resource){
    var Accounts = $resource('/accounts/:username', {id: '@id'}, {
      account: {url: '/account', method: 'GET'}
    });

    return Accounts;
  }]);

console.log('wonderlandLapp loaded');
