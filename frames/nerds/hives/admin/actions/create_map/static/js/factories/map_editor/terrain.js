(function (window) {

    var app = angular.module('NERDS_app');

    /**
     * Draws the hexagon graphic buttons.
     */

    app.factory('map_editor_terrain', function ($modal, TerrainTypes) {

        return  function ($scope) {

            // scale in meters
            $scope.map_sizes = [
                {
                    value: 100,
                    label: '100m (1 block)'
                },
                {
                    value: 1000,
                    label: '1km (10 blocks)'
                },
                {
                    value: 10 * 1000,
                    label: '10km (city)'
                },
                {
                    value: 100 * 1000,
                    label: '100km (county)'
                },
                {
                    value: 1000 * 1000,
                    label: '1,000km (nation)'
                },
                {
                    value: 10000 * 1000,
                    label: '10,000km (planet)'
                }
            ]

            $scope.map_width = $scope.map_sizes[3].value;

            $scope.paint_size = 1;

            TerrainTypes.query(function (tt) {
                $scope.terrain_types = tt;
                $scope.terrains = _.pluck(tt, 'name').concat('other...');

                var _c = _.template('rgb(<%= color.red %>,<%= color.green %>,<%= color.blue %>)');

                tt.forEach(function (t) {
                    $scope.colors[t.name] = _c(t);
                })
            });

            $scope.terrains = [
            ];

            $scope.colors = {
            };

            $scope.terrain_color = function (terrain) {
                return $scope.colors[terrain];
            };

            $scope.terrain = 'plains';

            function _change_terrain(terrain) {
                console.log('terrain changed to', terrain);
                if (terrain == 'other...') {
                    $scope.create_terrain();
                }
            }

            $scope.$watch('terrain', _change_terrain);


        };
    });

})(window);