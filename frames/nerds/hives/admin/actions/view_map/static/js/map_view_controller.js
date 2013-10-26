(function () {

    var app = angular.module('NERDS_app');

    // ----------------------- root controller ---------------------------

    function MapViewCtrl($scope, $modal, Games, Maps, game_info, $window, init_map_canvas, map_editor_draw_hexes, map_editor_draw_map, map_editor_city, map_editor_terrain, map_editor_road) {

        var MAP_ID = $window.map_id;

        console.log('map id:', MAP_ID);

        $scope.add_toolbar_button = function () {

        };

        var canvas = $('#game_creation').find('#map')[0];
        $scope.canvas = canvas;
        init_map_canvas($scope, canvas);
        map_editor_draw_map($scope);
        map_editor_city($scope);
        map_editor_terrain($scope);
        map_editor_road($scope);

        var _gotten = false;
        $scope.$watch('terrains', function (ts) {
            if (ts && ts.length && !_gotten) {
                _gotten = true;
                Maps.get({_id: MAP_ID}, function (map) {
                    $scope.map = map;

                    var hexes = _.flatten(map.hexes);
                    console.log('terrains: ', $scope.colors);
                    _.each(hexes, function (hex) {
                        if (hex.terrain && (!(hex.terrain == 'unknown'))) {
                            hex.terrain_color = $scope.terrain_color(hex.terrain);
                        }
                    })
                    map_editor_draw_hexes(hexes, $scope.hex_grid, $scope.city_container, $scope.map_container, canvas);
                    $scope.stage.update();
                });
            }
        })


    }

    app.controller('MapViewCtrl', MapViewCtrl);


})();