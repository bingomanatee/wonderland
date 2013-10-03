(function () {

    var app = angular.module('NERDS_app');

    app.directive('mapEditor', function InjectingFunction($http, hex_extent) {

        function _draw_hexes(hexes, container, canvas) {
            container.removeAllChildren();

            var extent = hex_extent(hexes);
            console.log('extent: ', extent);

            var width_ratio = canvas.width / extent.width;
            var height_ratio = canvas.height / extent.height;
            var ratio = Math.min(width_ratio, height_ratio);

            if (width_ratio > height_ratio) {
                container.x = (canvas.width - (extent.width * ratio)) / 2;
            } else {
                container.y = (canvas.height - (extent.height * ratio)) / 2;
            }

            _.each(hexes, function (hex) {

                hex.shape = new createjs.Shape();

                var last_point = _.last(hex.points);

                function _x(x) {
                    return (x - extent.min_x) * ratio;
                }

                function _y(y) {
                    return (y - extent.min_y) * ratio;
                }

                hex._x = _x;
                hex._y = _y;

                hex.draw = function (color) {
                    hex.shape.graphics.c();

                    hex.shape.graphics.f(color ? color : 'white').mt(_x(last_point.x), _y(last_point.y));

                    _.each(hex.points, function (point) {
                        hex.shape.graphics.lt(_x(point.x), _y(point.y));
                    });

                    hex.shape.graphics.ef();

                    hex.shape.graphics.s('black').mt(_x(last_point.x), _y(last_point.y));

                    _.each(hex.points, function (point) {
                        hex.shape.graphics.lt(_x(point.x), _y(point.y));
                    })
                    hex.shape.graphics.es();
                };

                hex.draw();

                container.addChild(hex.shape);
            })

        };

        function _add_hex_actions($scope, hexes) {

            _.each(hexes, function (hex) {

                hex.change_terrain = function () {
                    hex.terrain = $scope.terrain;
                    hex.draw($scope.terrain_color(hex.terrain));
                };


                hex.shape.addEventListener('click', function () {


                    if ($scope.paint_size > 1) {
                        _.each(_.filter(hexes, function (h) {

                            return Math.max(Math.abs(h.row - hex.row), Math.abs(h.column - hex.column)) < $scope.paint_size;

                        }), function (h) {
                            h.change_terrain();
                        });
                    } else {
                        hex.change_terrain();
                    }

                    $scope.stage.update();
                })


            });
        }

        // === InjectingFunction === //
        // Logic is executed 0 or 1 times per app (depending on if directive is used).
        // Useful for bootstrap and global configuration

        return {
            templateUrl: '/templates/admin/nerds/create_game/map_editor.html',

            controller: function ($scope, $modal) {

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

                $scope.terrains = [
                    'forest',
                    'grassland',
                    'desert',
                    'mountain',
                    'road',
                    'swamp',
                    'lake',
                    'ocean',
                    'other...'
                ];

                $scope.colors = {
                    forest: 'rgb(0,204,0)',
                    grassland: 'rgb(102,255,0)',
                    desert: 'yellow',
                    mountain: 'red',
                    road: 'grey',
                    ocean: 'blue',
                    lake: 'rgb(153, 153, 255)',
                    swamp: 'rgb(204,153, 102)'
                };

                $scope.terrain_color = function (terrain) {
                    return $scope.colors[terrain];
                };

                $scope.terrain = 'grassland';

                function _change_terrain(terrain) {
                    console.log('terrain changed to', terrain);
                    if (terrain == 'other...') {
                        $scope.create_terrain();
                    }
                }

                $scope.$watch('terrain', _change_terrain);

                $scope.hex_scale = 1;

                $scope.hex_scales = [0.25, 0.5, 1, 2];

                $scope.hex_scale_menu = function () {

                    return _.map($scope.hex_scales,

                        function (scale) {
                            var size = _hex_size($scope.map_width) * scale;

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

                function _hex_size(map_size) {
                    if (!map_size) {
                        map_size = $scope.map_width;
                    }

                    var hex_power = 0;
                    while (Math.pow(10, hex_power) < map_size) ++hex_power;
                    --hex_power;
                    return Math.pow(10, hex_power) * $scope.hex_scale;
                }

                function _redraw_map() {
                    console.log('width changed to ', $scope.map_width);
                    $http({method: 'GET', url: "/admin/nerds/hexes", params: { map_size: $scope.map_width, hex_size: _hex_size()}})
                        .success(function (hexes) {
                            hexes = _.flatten(hexes);
                            _draw_hexes(hexes, $scope.hex_grid, $scope.canvas);
                            _add_hex_actions($scope, hexes);
                            $scope.hexes = hexes;


                            $scope.stage.update();
                        });
                }

                $scope.$watch('map_width', _redraw_map);
                $scope.$watch('hex_scale', _redraw_map);
            },

            compile: function CompilingFunction($templateElement, $templateAttributes) {

                // === CompilingFunction === //
                // Logic is executed once (1) for every instance of ui-jq in your original UNRENDERED template.
                // Scope is UNAVAILABLE as the templates are only being cached.
                // You CAN examine the DOM and cache information about what variables
                //   or expressions will be used, but you cannot yet figure out their values.
                // Angular is caching the templates, now is a good time to inject new angular templates
                //   as children or future siblings to automatically run..

                return function LinkingFunction($scope, $linkElement, $linkAttributes) {

                    console.log('making easel editor ele ', $linkElement, 'scope', $scope);
                    $scope.canvas = $linkElement.find('canvas')[0];

                    $scope.stage = new createjs.Stage($scope.canvas);

                    $scope.hex_grid = new createjs.Container();
                    $scope.stage.addChild($scope.hex_grid);

                    var map_width = 0;

                };
            }
        };
    })

})(window)