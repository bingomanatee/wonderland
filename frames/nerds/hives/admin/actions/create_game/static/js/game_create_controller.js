(function () {

    var app = angular.module('NERDS_app');

    // ----------------------- root controller ---------------------------

    function CreateGameCtrl($scope, $modal, Games, Maps, $window, grid_button) {

        var GAME_ID = $window.game_id;

        $scope.game = Games.get({_id: GAME_ID});
        $scope.maps = Maps.query({game: GAME_ID});

        $scope.view_map = function(row){
           // console.log('row clicked:', row);

            document.location = '/admin/nerds/map/' + row.entity._id;
        }

        $scope.map_grid_options = {
            data: 'maps',

            enableRowSelection: false,
            enableCellSelection: false,
            columnDefs: [
                {field:'name', displayName:'Name', width: "***'"},
                {field: 'map_size', displayName: 'Size (m)', width: "**"},
                grid_button({name: 'edit', type: 'edit', action: 'edit_map(row)', label: 'Edit'}),
                grid_button({name: 'view', type: 'primary', action: 'view_map(row)', label: 'View'})
            ]

        };

        $scope.create_map = function(){
            document.location = '/admin/nerds/create_map/' + GAME_ID;
        }
    }

    app.controller('CreateGameCtrl', CreateGameCtrl);

})();