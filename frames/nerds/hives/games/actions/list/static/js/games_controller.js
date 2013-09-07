(function () {


    function GamesController($scope, $filter, $compile, Games, $window) {

        $scope.games = Games.query();

        $scope.go = function(row){
            console.log('row clicked: ', row);
            document.location = '/nerds/game/' + row.entity._id;
        };

        $scope.gameGridOptions = {
            data: 'games',
            showFilter: true,
            showGroupPanel: true,
            selectedItems: $scope.active_tweet,
            multiSelect: false,
            columnDefs: [
                {name: 'go', title: '&nbsp;', cellTemplate:
                    '<button id="editBtn" type="button" class="btn btn-primary" ng-click="go(row)" >Play</button> ',
                    width: '*'
                },
                {field: 'name', displayName: 'Name', width: '****'},
                {field: 'genre', displayName: 'Genre', width: '**'}
            ]

        };

    }

    GamesController.$inject = ['$scope', '$filter', '$compile', 'Games', '$window'];

    angular.module('NERDS_app').controller('GamesController', GamesController);

})();