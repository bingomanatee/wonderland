
angular.module('drawingsService', ['ngResource']).factory('drawings',
    function ($resource) {
        return $resource('/art/rest/drawings/:_id', {_id: '@_id'}, {
            get: {method: 'GET'},
            query: {method: 'GET', isArray: true},
            add: {method: 'POST'},
            update: {method: 'PUT'},
            remove: {method: 'REMOVE'}
        });
    });