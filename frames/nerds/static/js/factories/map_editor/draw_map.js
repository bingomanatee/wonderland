(function (window) {

    var app = angular.module('NERDS_app');

    /**
     * Draws the hexagon graphic buttons.
     */

    app.factory('map_editor_draw_map', function (map_editor_draw_hexes, hex_size, $http) {

        function _cityToJSON(){
            return {
                name: this.name,
                size: this.size,
                city_type: this.city_type,
                description: this.description,
                row: this.hex.row,
                column: this.hex.column
            };
        }

        function _hexToJSON(){
            var out = {
                row: this.row,
                column: this.column,
                points: this.points,
                terrain: this.terrain || 'unknown',
                city: this.city ? this.city.toJSON() : false
            };
            _.extend(out, out.center);

            if (this.city){
                out.city = this.city.toJSON();
            }

            return out;
        }

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
                    city.city_type = city.type;
                    city.toJSON = _.bind(_cityToJSON, city);
                    hex.city = city;
                    city.hex = hex;
                    hex.draw_city();
                    $scope.stage.update();

                };

                hex.toJSON = _.bind(_hexToJSON, hex);

               // console.log('hex:', hex);
            });
        }

        return  function ($scope) {

            $scope.hex_scale = 1;

            $scope.hex_scales = [0.25, 0.5, 1, 2];

            $scope.hex_scale_menu = function () {

                return _.map($scope.hex_scales,

                    function (scale) {
                        var size = hex_size($scope.map_width, $scope.hex_scale) * scale;

                        if (size > 10000) {
                            var size_string = Math.round(size / 1000) + 'km';
                        } else {
                            size_string = Math.round(size) + 'm';
                        }
                        return {
                            value: scale,
                            label: scale + '(' + size_string + ')'
                        }
                    }
                );
            };

            //@TODO: more presice control over when a blank hex grid is drawn

            function _redraw_map() {
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