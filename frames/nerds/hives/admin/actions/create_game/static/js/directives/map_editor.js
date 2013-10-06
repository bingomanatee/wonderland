(function () {

    var app = angular.module('NERDS_app');

    app.directive('mapEditor', function InjectingFunction($http, TerrainTypes, map_editor_draw_map, hex_size, easel_import) {

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
            $scope.map_container.addChild($scope.city_container);
            $scope.map_container.addChild($scope.road_container);
            $scope.map_container.addChild($scope.new_road_container);

            $scope.toolbar = new createjs.Container();
            $scope.stage.addChild($scope.toolbar);
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

                $scope.road_type = 'path';

                $scope.road_types = [
                    'path',
                    'cobblestone road',
                    'paved road',
                    'highway',
                    'railroad',
                    'subway'
                ];

                $scope.edit_tab = function (mode) {
                    $scope.map_edit_mode = mode;
                };

                $scope.map_edit_mode = 'terrain';

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

                map_editor_draw_map($scope);

                function _hex_event_terrain(hex) {

                    if ($scope.paint_size > 1) {
                        _.each(_.filter($scope.map_hexes, function (h) {

                            return Math.max(Math.abs(h.row - hex.row), Math.abs(h.column - hex.column)) < $scope.paint_size;

                        }), function (h) {
                            h.change_terrain();
                        });
                    } else {
                        hex.change_terrain();
                    }

                    $scope.stage.update();
                }

                function _hex_event_city(hex) {

                    function CreateCityCtrl($scope, $modalInstance, game_name, hex) {

                        $scope.game_name = game_name;

                        $scope.save = function () {
                            $modalInstance.close($scope.new_city);
                        };
                        $scope.cancel = _.bind($modalInstance.dismiss, $modalInstance);
                    }

                    $scope.new_city = {name: '', description: ''};

                    var modalInstance = $modal.open({
                            templateUrl: 'create_city.html',
                            controller: CreateCityCtrl,
                            scope: $scope,
                            resolve: {
                                hex: function () {
                                    return hex;
                                },
                                game_name: function () {
                                    return $scope.game.name ? $scope.game.name : 'Untitled"'
                                }
                            }
                        }
                    );

                    modalInstance.result.then(function (city) {
                        if (city) {
                            console.log('new city:', city);
                            hex.set_city(city);
                        }
                    }, function () {
                        console.log('City Modal dismissed at: ' + new Date());
                    });
                }

                $scope.road_points = [];

                function _draw_new_road() {
                    $scope.new_road_container.removeAllChildren();

                    var road_shape = new createjs.Shape();
                    $scope.new_road_container.addChild(road_shape);

                    if ($scope.road_points.length > 0){

                        var road_button = $scope.buttons.road;
                        road_button.getChildByName('save').visible = true;
                        road_button.getChildByName('cancel').visible = true;
                    }

                    if ($scope.road_points.length > 1) {
                        road_shape.graphics.ss(2).s('red', 0, 1).mt($scope.road_points[0].shape.x, $scope.road_points[0].shape.y);
                        $scope.road_points.slice(1).forEach(function (p) {

                            road_shape.graphics.lt(p.shape.x, p.shape.y);

                        })
                    }

                    $scope.stage.update();

                }

                $scope.save_road = function () {
                    console.log('adding road');
                }

                $scope.cancel_road = function () {
                    console.log('cancelling road');
                    $scope.road_points = [];
                    $scope.buttons.road.getChildByName('save').visible = false;
                    $scope.buttons.road.getChildByName('cancel').visible = false;
                    $scope.new_road_container.removeAllChildren();
                    $scope.stage.update();
                }

                function _hex_event_road(hex) {
                    if (_.contains($scope.road_points, hex)) {
                        $scope.road_points = _.reject($scope.road_points, function (p) {
                            return p === hex;
                        })
                    } else {
                        $scope.road_points.push(hex);
                    }

                    _draw_new_road();

                }

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

                $scope.editor_tabs = [
                    {
                        header: 'Terrain', select: "edit_tab('terrain')", active: true, name: 'terrain'
                    },
                    {
                        header: 'City', select: "edit_tab('city')", name: 'city'
                    }
                ];

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
                                _hex_event_terrain(hex);
                                break;

                            case 'city':
                                _hex_event_city(hex);
                                break

                            case 'road':
                                _hex_event_road(hex);
                                break;

                        }
                    });
                };
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

                    $scope.buttons = {};

                    function add_toolbar_button(shape, name, order) {

                        var button = new createjs.Container();
                        button.name = name;
                        button.x = button.y = 10;
                        button.y += order * 60;
                        shape.scaleX = shape.scaleY = 0.1;
                        shape.x = shape.y = 2;
                        shape.name = 'inner_button';
                        shape.addEventListener('click', function () {


                            $scope.$apply(function () {
                                $scope.map_edit_mode = name;
                                $('#paintTabs a[href="#' + name + '-tab"]').tab('show');

                            })

                        });

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

                        add_toolbar_button(shape, 'terrain', 0);

                    });

                    easel_import('52510ee1d03c2df321000004', function (err, shape) {

                        add_toolbar_button(shape, 'city', 1);

                    });

                    function _sub_button(text, name) {
                        var button = new createjs.Container();
                        button.name = name;

                        var button_back = new createjs.Shape();
                        button_back.graphics.s('black').f('white').ss(1).dr(0, 0, 60, 22).ef().es();
                        button_back.name = 'back';
                        button.addChild(button_back);

                        var text_shape = new createjs.Text(text, 'bold 10pt Arial', 'black');
                        text_shape.textAlign = 'center';
                        text_shape.x = 30;
                        text_shape.y = 3;
                        button.addChild(text_shape);
                        text_shape.name = 'label';

                        return button;
                    }

                    easel_import('525128c802d4aa8822000004', function (err, shape) {

                        var road_button = add_toolbar_button(shape, 'road', 2);

                        var save_button = _sub_button('Save', 'save');
                        save_button.visible = false;
                        road_button.addChild(save_button);
                        save_button.getChildByName('back').addEventListener('click', $scope.save_road);

                        var cancel_button = _sub_button('Cancel', 'cancel');
                        cancel_button.y = 28;
                        cancel_button.visible = false;
                        road_button.addChild(cancel_button);
                        cancel_button.getChildByName('back').addEventListener('click', $scope.cancel_road);

                        $scope.stage.update();

                    })

                };
            }
        };
    })

})
    (window);