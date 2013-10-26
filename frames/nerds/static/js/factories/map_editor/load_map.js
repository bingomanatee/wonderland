(function (window) {

    var app = angular.module('NERDS_app');

    /**
     * Draws the hexagon graphic buttons.
     */

    app.factory('map_editor_load_map', function (map_editor_draw_hexes, hex_size, $http) {


        return function($scope){

        $scope.load_map = function (map) {

            $scope.map = map;

            var hexes = _.flatten(map.hexes);

            console.log('cities', _.compact(_.pick(map.hexes, 'city')));
            _.each(hexes, function (hex) {
                if (hex.terrain && (!(hex.terrain == 'unknown'))) {
                    hex.terrain_color = $scope.terrain_color(hex.terrain);
                }
            });

            map_editor_draw_hexes(hexes, $scope.hex_grid, $scope.city_container, $scope.map_container, $scope.canvas);

            _.each(map.roads, function (road) {
                $scope.new_road(road)
            });
            $scope.draw_roads();

            $scope.stage.update();
        };
    }
    })
})(window);