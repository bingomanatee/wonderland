(function () {

    var app = angular.module('NERDS_app');

    app.directive('mapViewer', function InjectingFunction($http, $modal, TerrainTypes, Maps, map_editor_draw_map, hex_size, easel_import, map_editor_road, map_editor_terrain, map_editor_city, game_info) {

        function _init_scope_canvas($scope, $linkElement) {

            console.log('making easel editor ele ', $linkElement, 'scope', $scope);
            $scope.canvas = $linkElement.find('canvas')[0];

            $scope.stage = new createjs.Stage($scope.canvas);

            $scope.map_container = new createjs.Container();
            $scope.stage.addChild($scope.map_container);

            $scope.hex_grid = new createjs.Container();
            $scope.city_container = new createjs.Container();
            var cities = new createjs.Container();
            cities.name = 'cities';
            var city_labels = new createjs.Container();
            city_labels.name = 'labels';
            $scope.city_container.addChild(cities);
            $scope.city_container.addChild(city_labels);

            $scope.road_container = new createjs.Container();
            $scope.new_road_container = new createjs.Container();

            $scope.map_container.addChild($scope.hex_grid);
            $scope.map_container.addChild($scope.road_container);
            $scope.map_container.addChild($scope.new_road_container);
            $scope.map_container.addChild($scope.city_container);

            $scope.toolbar = new createjs.Container();
            $scope.stage.addChild($scope.toolbar);
        }

        // === InjectingFunction === //
        // Logic is executed 0 or 1 times per app (depending on if directive is used).
        // Useful for bootstrap and global configuration

        return {
            templateUrl: '/templates/admin/nerds/map/map_viewer.html',

            controller: function ($scope) {

                $scope.edit_tab = function (mode) {
                    $scope.map_edit_mode = mode;
                };

                $scope.$watch('map_edit_mode', function () {
                    $scope.update_draw_buttons();
                });

                $scope.update_draw_buttons = function () {
                    console.log('updating buttons with mode ', $scope.map_edit_mode);
                    _.each($scope.buttons, function (button, name) {
                        console.log(' ... for button ', name);
                        button.getChildByName('back').visible = ($scope.map_edit_mode == name);
                    });

                    $scope.stage.update();
                };

                $scope.map_edit_mode = 'terrain';

                $scope.hex_event_terrain = function (hex) {

                    if ($scope.paint_size > 1) {
                        _.each(_.filter($scope.map_hexes, function (h) {
                            // get hexes in the range of the clicked on hex
                            return Math.max(Math.abs(h.row - hex.row), Math.abs(h.column - hex.column)) < $scope.paint_size;

                        }), function (h) {
                            h.change_terrain();
                        });
                    } else {
                        hex.change_terrain();
                    }

                    $scope.stage.update();
                }

                map_editor_draw_map($scope);
                map_editor_city($scope);
                map_editor_terrain($scope);
                map_editor_road($scope);

                $('#editor-tabs a').click(function (e) {
                    e.preventDefault();

                    console.log('e clicked', e);
                    var m = /#(.*)-/.exec(e.target.href);
                    $scope.$apply(function () {
                        $scope.map_edit_mode = m[1];
                    });

                    $(this).tab('show');
                });

                $scope.hex_clicked = function (hex) {
                    $scope.$apply(function () {

                        switch ($scope.map_edit_mode) {
                            case 'terrain':
                                $scope.hex_event_terrain(hex);
                                break;

                            case 'city':
                                $scope.hex_event_city(hex);
                                break;

                            case 'road':
                                $scope.hex_event_road(hex);
                                break;

                        }
                    });
                };

                $scope.save_map = function () {

                    function CreateMapCtrl($scope, $modalInstance, game_name) {

                        $scope.game_name = game_name;

                        $scope.new_map = {name: '', description: ''};

                        $scope.save = function () {
                            $modalInstance.close($scope.new_map);
                        };
                        $scope.cancel = _.bind($modalInstance.dismiss, $modalInstance);
                    }

                    $scope.$apply(function () {

                        var modalInstance = $modal.open({
                                templateUrl: 'create_map.html',
                                controller: CreateMapCtrl,
                                scope: $scope,
                                resolve: {
                                    game_name: function () {
                                        return $scope.game.name ? $scope.game.name : 'Untitled'
                                    }
                                }
                            }
                        );

                        modalInstance.result.then(function (map_data) {
                            if (map_data) {
                                console.log('map data:', map_data);
                                var game = game_info();

                                var out = {
                                    game: game._id,
                                    map_size: $scope.map_width,
                                    hex_size: hex_size($scope.map_width, $scope.hex_scale)
                                };
                                _.extend(out, map_data);

                                out.hexes = _.map(_.flatten($scope.hexes), function (hex) {
                                    return hex.toJSON()
                                });

                                out.roads = _.map($scope.roads, function (road) {
                                    return road.toJSON();
                                });

                                console.log('saving map', out);

                                Maps.put(out, function (saved_map) {
                                    document.location = '/admin/nerds/map/' + saved_map._id;
                                })
                            }
                        }, function () {
                            console.log('Map Modal dismissed at: ' + new Date());
                        });

                    })

                };

                $scope.buttons = {};

                $scope.add_toolbar_button = function add_toolbar_button(shape, name, order, is_tab) {

                    var button = new createjs.Container();
                    button.name = name;
                    button.x = button.y = 10;
                    button.y += order * 60;
                    shape.scaleX = shape.scaleY = 0.1;
                    shape.x = shape.y = 2;
                    shape.name = 'inner_button';
                    if (is_tab) {
                        shape.addEventListener('click', function () {


                            $scope.$apply(function () {
                                $scope.map_edit_mode = name;
                                $('#paintTabs a[href="#' + name + '-tab"]').tab('show');

                            })

                        });
                        button.is_tab = !!is_tab;
                    }

                    var button_back = new createjs.Shape();
                    button_back.graphics.f('black').dc(28, 28, 28).ef();
                    button_back.name = 'back';

                    button.addChild(button_back);
                    button.addChild(shape);

                    $scope.toolbar.addChild(button);

                    $scope.buttons[name] = button;

                    $scope.update_draw_buttons();
                    return button;
                }

                easel_import('5250487f508865db13000004', function (err, shape) {
                    $scope.add_toolbar_button(shape, 'terrain', 0, 1);

                });

                easel_import('52510ee1d03c2df321000004', function (err, shape) {
                    $scope.add_toolbar_button(shape, 'city', 1, 1);

                });

                easel_import('5251e087202e87d525000004', function (err, shape) {
                    $scope.add_toolbar_button(shape, 'save', 3).addEventListener('click', function () {
                        $scope.save_map();
                    });
                });
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

                    _init_scope_canvas($scope, $linkElement);


                };
            }
        };
    })

})
    (window);