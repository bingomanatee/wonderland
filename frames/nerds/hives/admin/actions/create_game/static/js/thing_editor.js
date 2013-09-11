(function () {

    var STAGE_WIDTH = 400;
    var STAGE_HEIGHT = 400;
    var GRID_SIZE = 25;
    var MAX_A = Math.max(STAGE_WIDTH, STAGE_HEIGHT);
    var HANDLE_SIZE = 15;
    var ROT_BOX_SIZE = 10;

    var app = angular.module('NERDS_app');

    function _add_thing_part(sprite_type, thing, stage, color) {

        var shape = new createjs.Shape();
        shape.__thing_order = thing.draw_steps.length;
        return  new Thing_Sprite(sprite_type, thing, stage, color);
    }

    function _make_grid(stage) {
        var grid = new createjs.Shape();
        stage.addChild(grid);
        grid.graphics.s('rgb(225,225,225)');

        var draw_container = new createjs.Container();
        stage.addChild(draw_container);

        for (var a = 0; a < MAX_A; a += GRID_SIZE) {
            grid.graphics.mt(0, a).lt(STAGE_HEIGHT, a);
            grid.graphics.mt(a, 0).lt(a, STAGE_WIDTH)

        }
        grid.graphics.es();
    }

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

    // --------------------------- type graph ---------------------------------

    app.factory('typeGraph', function () {

        return function ($scope, GAME_ID, $modal) {
            $scope.current_color = 'rgb(125, 255, 0)';

            var scope_ele = $('#thing_editor');
            var create_canvas = scope_ele.find('.thing_canvas')[0];

            var stage = new createjs.Stage(create_canvas);
            var click_shape = new createjs.Shape();
            click_shape.graphics.f('rgb(245,255,255)').r(0, 0, STAGE_WIDTH, STAGE_HEIGHT).ef();
            stage.addChild(click_shape);

            click_shape.addEventListener('mousedown', function (ev) {
                var sprite = _add_thing_part($scope.draw_state, $scope.thing, stage, $scope.current_color);
                sprite.container.x = ev.stageX - (ev.stageX % GRID_SIZE);
                sprite.container.y = ev.stageY - (ev.stageY % GRID_SIZE);
                stage.update();
            });

            _make_grid(stage);

            stage.update();

            $scope.thing = {
                name: 'new thing',
                type: '',
                anchor: 'C',
                draw_steps: []
            };

            $scope.object_types = ['person', 'place', 'scenery'];

            $scope.draw_state = '';

            $scope.db_icon = function (item) {
                var classes = [item];
                if ($scope.draw_state == item) {
                    classes.push('active');
                }
                return classes.join(' ');
            };

            $scope.thing_draw = function (sprite_type) {
                $scope.draw_state = sprite_type;

                _add_thing_part(sprite_type, $scope.thing, stage, $scope.current_color);
            };

            setTimeout(function () {
                var field = $($('#thing_editor .ui .color input')[0]);
                console.log('field:', field);

                setInterval(function () {
                    if (field.val() != $scope.current_color) {
                        $scope.current_color = field.val();
                        $scope.$apply();
                    }
                }, 1200);
            }, 500);

            $scope.$watch('current_color', function (c) {
                console.log('current color changed to ', c);
            })

            return {
                stage: stage
            };
        }
    });

})();
