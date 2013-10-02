angular.module("PaintApp", ['Paint', 'drawingsService']);


angular.module('drawingsService', ['ngResource', 'ui.bootstrap', 'ui.bootstrap.modal']).factory('drawings',
    function ($resource) {
        return $resource('/art/rest/drawings/:_id', {_id: '@_id'}, {
            get: {method: 'GET'},
            query: {method: 'GET', isArray: true},
            add: {method: 'POST'},
            update: {method: 'PUT'}
        });
    });