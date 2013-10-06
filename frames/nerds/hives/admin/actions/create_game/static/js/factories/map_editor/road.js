(function (window) {

    var app = angular.module('NERDS_app');

    /**
     * Draws the hexagon graphic buttons.
     */

    app.factory('map_editor_road', function ($modal) {

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
                road.points = $scope.road_points;
                $scope.road_points = [];
                $scope.roads.push(road);
                $scope.stage.update();
            }

            $scope.save_road = function () {
                console.log('adding road');
                if ($scope.road_points.length < 2) {
                    $scope.cancel_road();
                } else {

                    function CreateRoadCtrl($scope, $modalInstance, road_type, game_name) {

                        $scope.new_road = {name: '', description: '', road_type: road_type || 'path'};

                        $scope.road_types = [
                            'path',
                            'cobblestone road',
                            'paved road',
                            'highway',
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

            $scope.cancel_road = function () {
                console.log('cancelling road');
                $scope.road_points = [];
                $scope.buttons.road.getChildByName('save').visible = false;
                $scope.buttons.road.getChildByName('cancel').visible = false;
                $scope.new_road_container.removeAllChildren();
                $scope.stage.update();
            };

            $scope.roads = [];
            $scope.road_grid_options = { data: 'roads',
                columnDefs: [
                    { field: "name", displayName: 'City', width: '***' },
                    { field: "road_type", displayName: 'Type', width: "*" }]

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