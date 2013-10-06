(function (window) {

    var app = angular.module('NERDS_app');

    /**
     * Draws the hexagon graphic buttons.
     */

    app.factory('map_editor_draw_map', function (map_editor_draw_hexes, hex_size, $http) {


        function _add_hex_actions($scope, hexes) {
            $scope.map_hexes = hexes;
            _.each(hexes, function (hex) {

                hex.change_terrain = function () {
                    hex.terrain = $scope.terrain;
                    hex.terrain_color = $scope.terrain_color(hex.terrain);
                    hex.draw();
                };

                hex.shape.addEventListener('click', function () {

                    $scope.hex_clicked(hex);
                })

                hex.set_city = function (city) {
                    hex.city = city;
                    hex.draw_city();
                    $scope.stage.update();
                };

            });
        }

        return  function ($scope) {

            function _redraw_map() {
                console.log('width changed to ', $scope.map_width);
                $http({method: 'GET', url: "/admin/nerds/hexes", params: { map_size: $scope.map_width, hex_size: hex_size($scope.map_width, $scope.hex_scale)}})
                    .success(function (hexes) {
                        hexes = _.flatten(hexes);
                        map_editor_draw_hexes(hexes, $scope.hex_grid, $scope.city_container, $scope.map_container, $scope.canvas);

                        _add_hex_actions($scope, hexes);
                        $scope.hexes = hexes;

                        $scope.stage.update();
                    });
            }

            $scope.$watch('map_width', _redraw_map);
            $scope.$watch('hex_scale', _redraw_map);
        }

    });

})(window);