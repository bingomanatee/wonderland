(function () {

    var app = angular.module('NERDS_app');

    // ----------------------- root controller ---------------------------

    function GameCreationCtrl($scope, $filter, $compile, $modal,
                              Games, Places, Things, placeGraph, typeGraph,
                              $window) {

        var GAME_ID = $window.game_id;

        $scope.games = Games.query();
        $scope.game = Games.get({_id: GAME_ID});

        $scope.places = Places.query({game: GAME_ID});

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

        var pg = placeGraph($scope, GAME_ID, $modal);
        var tg = typeGraph($scope, GAME_ID, $modal);

        $scope.create = function (type) {
        };

    }

    GameCreationCtrl.$inject = ['$scope', '$filter', '$compile', '$modal',
        'Games', 'Places', 'Things', 'placeGraph', 'typeGraph',
        '$window'];


    app.controller('GameCreationCtrl', GameCreationCtrl);

})();