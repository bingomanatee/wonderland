(function (window) {

    var app = angular.module('NERDS_app');

    app.directive('thingEditor', function InjectingFunction(Things) {

        return {
            templateUrl: '/templates/admin/nerds/create_game/thing_editor.html',
            compile: function CompilingFunction($templateElement, $templateAttributes) {

                return function LinkingFunction($scope, $linkElement, $linkAttributes) {

                    $scope.current_color = 'rgb(125, 255, 0)';
                    $scope.new_thing = function () {
                        if ($scope.thing_canvas){
                            $scope.thing_canvas.reset();
                        }
                        $scope.thing = {
                            name: 'new thing',
                            thing_type: '',
                            game: window.GAME_ID,
                            anchor: 'C',
                            sprites: []
                        };
                    };
                    $scope.new_thing();

                    $scope.thing_canvas = new Thing_Canvas($scope);

                    $scope.$watch('current_color', function (cc) {
                        $scope.thing_canvas.update_color(cc);
                    });

                    $scope.object_types = ['person', 'place', 'scenery'];

                    $scope.db_icon = function (item) {
                        //   console.log('item: ', item, 'draw_state: ', $scope.draw_state);
                        var classes = [item];
                        if ($scope.draw_state == item) {
                            classes.push('active');
                        }
                        return classes.join(' ');
                    };

                    $scope.draw_state = '';
                    $scope.add_sprite = function (sprite_type) {

                        if (this.draw_state == sprite_type) { // toggle
                            this.draw_state = '';
                            $scope.thing_canvas.add_sprite(false);
                            return;
                        }

                        $scope.draw_state = sprite_type;
                        $scope.thing_canvas.add_sprite(sprite_type);
                    };

                    $scope.remove_sprite = function () {
                        $scope.thing_canvas.remove_sprite();
                    };

                    $scope.move_sprite = function (dir) {
                        $scope.thing_canvas.move_sprite(dir);
                    };

                    $scope.$watch('current_color', function (c) {
                        console.log('current color changed to ', c);
                    });

                    $scope.set_poly_state = function (state) {
                        $scope.poly_button_state = state;
                    };

                    $scope.close_poly = function () {
                        $scope.thing_canvas.close_poly();
                    };

                    $scope.save_thing = function (save) {
                        if (save) {
                            if (!$scope.thing.sprites.length){
                                alert('please add sprites to your thing');
                                return;
                            }
                            try {

                                $scope.thing.sprites = _.map($scope.thing.sprites, function (sprite) {
                                    return sprite.export();
                                });

                                Things.add($scope.thing);
                            } catch (err) {
                                console.log('error saving sprite:', err);
                            }

                            $scope.things = Things.query({game: window.GAME_ID});
                        }

                        $scope.new_thing();
                        $scope.thing_canvas.us();
                    };

                    $scope.poly_button_state_class = function (state) {
                        var classes = ['btn'];
                        if ($scope.poly_button_state == state) classes.push('btn-primary');
                        return classes.join(' ');
                    };

                };
            }
        };
    })

})(window);