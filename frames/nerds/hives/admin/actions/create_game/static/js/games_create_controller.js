(function () {

    var app = angular.module('NERDS_app');

    // ----------------------- root controller ---------------------------

    function GameCreationCtrl($scope, $filter, $compile, $modal,
                              Games, Places, Things,
                              $window) {

        var GAME_ID = $window.game_id;

        $scope.games = Games.query();
        $scope.game = Games.get({_id: GAME_ID});

        $scope.places = Places.query({game: GAME_ID});
        $scope.things = Things.query({game: GAME_ID});

        $scope.placeGridOptions = {
            data: 'places',
            showFilter: true,
            showGroupPanel: true,
            multiSelect: false,
            columnDefs: [
                {field: 'name', displayName: 'Name', width: '***'},
                {field: 'type', displayName: 'Type', width: '*'},
                {field: 'description', displayName: 'Description', width: '****'}
            ]
        };

        $scope.thingGridOptions  = {
            data: 'things',
            showFilter: true,
            showGroupPanel: true,
            multiSelect: false,
            columnDefs: [
                {field: 'name', displayName: 'Name', width: '****'},
                {field: 'thing_type', displayName: 'Type', width: '**'},
                {field: 'anchor', displayName: 'A', width: '*'},
                {field: 'global', displayName: 'Global', width: '*'}
            ]
        };

        $scope.create = function (type) {
        };

    }

    GameCreationCtrl.$inject = ['$scope', '$filter', '$compile', '$modal',
        'Games', 'Places', 'Things',
        '$window'];


    app.controller('GameCreationCtrl', GameCreationCtrl);

})();