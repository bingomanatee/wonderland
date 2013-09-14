(function (window) {

    var app = angular.module('NERDS_app');

    app.directive('thingEditor', function InjectingFunction(Things) {

        return {
            templateUrl: '/js/nerds/directives/templates/thing_editor.html',
            compile: function CompilingFunction($templateElement, $templateAttributes) {

                return function LinkingFunction($scope, $linkElement, $linkAttributes) {

                    console.log('link attributes: ', $linkAttributes);

                    $scope.current_color = 'rgb(125, 255, 0)';
                    $scope.new_thing = function () {
                        if ($scope.thing_canvas){
                            $scope.thing_canvas.reset();
                        }
                        $scope.thing = {
                            name: 'new thing',
                            thing_type: '',
                            anchor: 'C',
                            sprites: []
                        };
                        if ($linkAttributes.thingEditor == 'global'){
                            $scope.thing.global= true;
                        } else if ($linkAttributes.thingEditor){
                            $scope.thing.game = $linkAttributes.thingEditor;
                        } else {
                            throw new Error('no game_id or global parameter');
                        }
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

                    _.each(['remove_sprite', 'move_sprite', 'clone_sprite', 'close_poly', 'max_width', 'max_height', 'choose_color'],
                        function(method){
                           $scope[method] = function(){
                               var args = _.toArray(arguments);
                               $scope.thing_canvas[method].apply($scope.thing_canvas, args);
                           }
                        });

                    $scope.$watch('current_color', function (c) {
                        console.log('current color changed to ', c);
                    });

                    $scope.set_poly_state = function (state) {
                        $scope.poly_button_state = state;
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