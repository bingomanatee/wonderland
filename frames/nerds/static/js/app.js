(function () {

    angular.module('gamesService', ['ngResource']).factory('Games',
        function ($resource) {
            return $resource('/nerds/rest/games/:_id', {_id: '@_id'}, {
                get: {method: 'GET'},
                query: {method: 'GET', isArray: true},
                update: {method: 'PUT'}
                });
        });

    angular.module('skillsService', ['ngResource']).factory('Skills',
        function ($resource) {
            return $resource('/nerds/rest/skills/:skill_id', {}, {
                get: {method: 'GET'},
                query: {method: 'GET', isArray: true}
            });
        });
    var NERDS_app = angular.module('NERDS_app', ['gamesService', 'skillsService', 'ngGrid', 'ui.bootstrap', 'ui.bootstrap.modal']);

})();