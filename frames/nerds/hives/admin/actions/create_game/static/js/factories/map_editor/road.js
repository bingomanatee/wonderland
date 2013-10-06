(function (window) {

    var app = angular.module('NERDS_app');

    /**
     * Draws the hexagon graphic buttons.
     */

    app.factory('map_editor_road', function ($modal) {

        function wander(value, scale) {
            var rand = (Math.sin(Math.random() * 100)) / 2;
            var offset = scale * rand;
            console.log('wander: rand', rand, 'offset:', offset);
            return value + offset;
        }

        var MIN_DIST = 5;

        function _dist(x1, y1, x2, y2) {
            var dx = x2 - x1;
            var dy = y2 - y1;
            return Math.sqrt(dx * dx + dy * dy);
        }

        function _midpoint(x1, y1, x2, y2, scale) {
            return  {
                x: wander((x1 + x2) / 2, scale),
                y: wander((y1 + y2) / 2, scale)
            };
        }

        function _point_go_to(from_point, to_point) {
            if (to_point) {
                from_point.midpoints = [];
                var midpoint = _midpoint(from_point.draw_x, from_point.draw_y, to_point.draw_x, to_point.draw_y, from_point.hex.height());
                from_point.midpoints.push(midpoint);

                var too_long = false;

                do {
                    too_long = false;
                    from_point.midpoints = _.reduce(from_point.midpoints, function (out, point, i) {
                        var dist, scale;
                        if (i == 0) {
                             dist = _dist(from_point.draw_x, from_point.draw_y, point.x, point.y);
                            console.log('dist', dist);
                            if (dist > MIN_DIST) {
                                 scale = Math.min(from_point.hex.height()/2, dist/4);
                                out.push(_midpoint(from_point.draw_x, from_point.draw_y, point.x, point.y, scale));
                                too_long = true;
                            }
                        }  else {
                            var prev = from_point.midpoints[i - 1];
                             dist = _dist(prev.x, prev.y, point.x, point.y);
                            if (dist > MIN_DIST){
                                 scale = Math.min(from_point.hex.height(), dist/3);
                                out.push(_midpoint(prev.x, prev.y, point.x, point.y, scale));
                                too_long = true;
                            }
                        }

                        out.push(point);
                        return out;
                    }, []);
                } while (too_long);
            }
        }

        function _windy_road(road) {
            _.each(road.points, function (point, i) {
                _point_go_to(point, road.points[i + 1])
            });
            console.log('road points:', road.points);
        }

        return  function ($scope) {


            $scope.road_points = [];

            $scope.draw_new_road = function () {
                $scope.new_road_container.removeAllChildren();
                var road_button = $scope.buttons.road;

                var road_shape = new createjs.Shape();
                $scope.new_road_container.addChild(road_shape);


                road_button.getChildByName('save').visible = false;
                road_button.getChildByName('save').visible = false;

                if ($scope.road_points.length > 0) {

                    road_button.getChildByName('cancel').visible = true;
                }

                if ($scope.road_points.length > 1) {
                    road_button.getChildByName('save').visible = true;
                    road_shape.graphics.ss(2).s('red', 0, 1).mt($scope.road_points[0].shape.x, $scope.road_points[0].shape.y);
                    $scope.road_points.slice(1).forEach(function (p) {

                        road_shape.graphics.lt(p.shape.x, p.shape.y);

                    })
                }

                $scope.stage.update();

            }
            $scope.roads = [];
            $scope.add_road = function (road) {
                road.points = $scope.road_points.map(function (hex) {

                    return{
                        hex: hex,
                        draw_x: wander(hex.shape.x, hex.height()/4),
                        draw_y: wander(hex.shape.y, hex.height()/4)
                    }
                });

                _windy_road(road);
                $scope.roads.push(road);
                _clear_road();
                $scope.draw_roads();
            };

            $scope.save_road = function () {
                console.log('adding road');
                if ($scope.road_points.length < 2) {
                    $scope.cancel_road();
                } else {

                    function CreateRoadCtrl($scope, $modalInstance, road_type, game_name) {

                        $scope.new_road = {name: '', description: '', road_type: road_type || 'path'};

                        $scope.road_types = [
                            'path',
                            'cobblestone',
                            'paved',
                            'avenue',
                            'highway',
                            'freeway',
                            'railroad',
                            'subway'
                        ];

                        $scope.game_name = game_name;

                        $scope.save = function () {
                            $modalInstance.close($scope.new_road);
                        };
                        $scope.cancel = _.bind($modalInstance.dismiss, $modalInstance);
                    }


                    $scope.$apply(function () {
                        var modalInstance = $modal.open({
                                templateUrl: 'create_road.html',
                                controller: CreateRoadCtrl,
                                scope: $scope,
                                resolve: {
                                    road_type: function () {
                                        return $scope.road_type ? $scope.road_type : 'path'
                                    },
                                    game_name: function () {
                                        return $scope.game.name ? $scope.game.name : 'Untitled"'
                                    }
                                }
                            }
                        );

                        modalInstance.result.then(function (road) {
                            if (road) {
                                console.log('saving road:', road);
                                $scope.add_road(road);
                            }
                        }, function () {
                            console.log('Road Modal dismissed at: ' + new Date());
                        });
                    });
                }
            }

            function _clear_road() {
                $scope.road_points = [];
                $scope.buttons.road.getChildByName('save').visible = false;
                $scope.buttons.road.getChildByName('cancel').visible = false;
                $scope.new_road_container.removeAllChildren();
                $scope.stage.update();
            }

            $scope.draw_roads = function () {

                
                function _stroke_road_points(points, shape){
                    var p0 = points[0];
                    shape.graphics.mt(p0.draw_x, p0.draw_y);

                    points.slice(1).forEach(function (point, i) {
                        var mp = points[i].midpoints; // i is the index of the PREVIOUS point, due to the slice.
                        if (mp) {
                            _.each(mp, function (m) {
                                shape.graphics.lt(m.x, m.y);
                            })
                        } else {
                            console.log('slice point ', i, ' -- no mids');
                        }
                        shape.graphics.lt(point.draw_x, point.draw_y);
                    });
                    shape.graphics.es();
                }

                $scope.road_container.removeAllChildren();

                _.each($scope.roads, function (road) {
                    var road_shape = new createjs.Shape();

                    switch(road.road_type){
                        case 'path':
                            road_shape.graphics.s('rgb(204,153,153)').ss(1);
                            _stroke_road_points(road.points, road_shape);
                            break;

                        case 'cobblestone':
                            road_shape.graphics.s('rgb(204,204,204)').ss(2);
                            _stroke_road_points(road.points, road_shape);
                            break;

                        case 'paved':
                            road_shape.graphics.s('black').ss(2);
                            _stroke_road_points(road.points, road_shape);

                            break;

                        case 'subway':
                            road_shape.graphics.s('rgb(0,0,204)').ss(2);
                            _stroke_road_points(road.points, road_shape);

                            break;

                        case 'avenue':
                            road_shape.graphics.s('black').ss(4);
                            _stroke_road_points(road.points, road_shape);
                            road_shape.graphics.s('rgb(204,204,204)').ss(2);
                            _stroke_road_points(road.points, road_shape);

                            break;

                        case 'highway':
                            road_shape.graphics.s('black').ss(4);
                            _stroke_road_points(road.points, road_shape);
                            road_shape.graphics.s('yellow').ss(3);
                            _stroke_road_points(road.points, road_shape);

                            break;

                        case 'freeway':
                            road_shape.graphics.s('black').ss(5);
                            _stroke_road_points(road.points, road_shape);
                            road_shape.graphics.s('red').ss(4);
                            _stroke_road_points(road.points, road_shape);

                            break;

                        case 'railroad':
                            road_shape.graphics.s('black').ss(4);
                            _stroke_road_points(road.points, road_shape);
                            road_shape.graphics.s('rgb(51,255,0)').ss(3);
                            _stroke_road_points(road.points, road_shape);

                            break;

                        default:
                            road_shape.graphics.s('black').ss(3);
                            _stroke_road_points(road.points, road_shape);
                            road_shape.graphics.s('white').ss(2);
                            _stroke_road_points(road.points, road_shape);

                    }
                    $scope.road_container.addChild(road_shape);

                });

                $scope.stage.update();
            };

            $scope.cancel_road = function () {
                _clear_road();
            };

            $scope.roads = [];
            $scope.road_grid_options = { data: 'roads',
                columnDefs: [
                    { field: "name", displayName: 'Road', width: '***' },
                    { field: "road_type", displayName: 'Type', width: "*" }
                ]

            };

            $scope.hex_event_road = function (hex) {
                if (_.contains($scope.road_points, hex)) {
                    $scope.road_points = _.reject($scope.road_points, function (p) {
                        return p === hex;
                    })
                } else {
                    $scope.road_points.push(hex);
                }

                $scope.draw_new_road();

            }
        }

    });

})(window);