(function () {

    /**
     * This factory handles most of the binding/variable interaction.
     * The sprite drawing is handled by Thing_Canvas and Thing_Sprite.
     *
     */

    var app = angular.module('NERDS_app');

    var field;

    function _update_current_color($scope) {
        setInterval(function () {
            if (!field) return  field = $($('#thing_editor .ui .color input')[0]);
            if (field.val() != $scope.current_color) {
                $scope.current_color = field.val();
                $scope.$apply();
            }
        }, 1200);
    }

    // --------------------------- type graph ---------------------------------

    app.factory('typeGraph', function () {

        return function ($scope, GAME_ID, $modal) {

            _update_current_color($scope);

            $scope.current_color = 'rgb(125, 255, 0)';
            $scope.new_thing = function () {
                $scope.thing = {
                    name: 'new thing',
                    type: '',
                    game: GAME_ID,
                    anchor: 'C',
                    sprites: []
                };
            };
            $scope.new_thing();

            $scope.thing_canvas = new Thing_Canvas($scope);

            $scope.$watch('current_color', function(cc){
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

                if (this.draw_state == sprite_type ){ // toggle
                    this.draw_state = '';
                    $scope.thing_canvas.add_sprite(false);
                    return;
                }

                $scope.draw_state = sprite_type;
                $scope.thing_canvas.add_sprite(sprite_type);
            };

            $scope.remove_sprite = function(){
                $scope.thing_canvas.remove_sprite();
            };

            $scope.move_sprite = function(dir){
                $scope.thing_canvas.move_sprite(dir);
            };

            $scope.$watch('current_color', function (c) {
                console.log('current color changed to ', c);
            });

            $scope.set_poly_state = function(state){
                $scope.poly_button_state = state;
            };

            $scope.close_poly = function(){
              $scope.thing_canvas.close_poly();
            };

            $scope.poly_button_state_class = function(state){
                var classes = ['btn'];
                if ($scope.poly_button_state == state) classes.push('btn-primary');
                return classes.join(' ');
            };
        }
    });

    // ----------------------- modal for editing thing ---------------------------
    // currently unused
    function ThingEditorModal($scope, $modalInstance, game, target) {
        $scope.game = game;
        $scope.target = target;

        $scope.save = function () {
            $modalInstance.close(target);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        }
    }

    angular.module('NERDS_app').controller('ThingEditorModal', ThingEditorModal);

})();
