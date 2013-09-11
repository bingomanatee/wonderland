(function () {

    var STAGE_WIDTH = 400;
    var STAGE_HEIGHT = 400;
    var GRID_SIZE = 25;
    var MAX_A = Math.max(STAGE_WIDTH, STAGE_HEIGHT);
    var HANDLE_SIZE = 15;

    var app = angular.module('NERDS_app');

    function Sprite(type, thing, container, stage) {
        this.stage = stage;
        this.type = type;
        this.container = container;
        this.width = this.height = GRID_SIZE * 2;
        this.redraw_shape();

        thing.draw_steps.push(this);

        this.shape.addEventListener('mousedown', _.bind(this._on_mousedown, this));
        stage.update();
    }

    Sprite.prototype = {

        redraw_shape: function () {
            if (!this.shape) {
                this.shape = new createjs.Shape();
                this.shape.__sprite = this;
                this.container.addChild(this.shape);
                this._add_boxes();
            } else {
                this.shape.graphics.c();
            }

            switch (this.type) {
                case 'rectangle':
                    this.shape.graphics.f('#000000').r(0, 0, this.width, this.height).ef();
                    break;
            }

            this._update_handles();
            this.stage.update();
        },

        _add_boxes: function () {
            this._br_handle = new createjs.Shape();
            this._br_handle.graphics.f('rgba(0,0,0, 0.75').r(0, 0, HANDLE_SIZE, HANDLE_SIZE);
            this.container.addChild(this._br_handle);

            this._br_handle.addEventListener('mousedown', _.bind(this._on_br_mousedown, this));
            this._update_handles();
            this._start_br_fade();
        },

        _start_br_fade: function () {
            if (this._sbfto) {
                clearTimeout(this._sbfto);
            }
            var self = this;
            this._br_handle.visible = true;
            this.stage.update();
            this._sbfto = setTimeout(function () {
                self._br_handle.visible = false;
                self.stage.update();
            }, 2000);
        },

        _update_handles: function () {
            this._br_handle.x = this.shape.x + this.width;
            this._br_handle.y = this.shape.y + this.height;
        },

        _on_mousedown: function (event) {

            this._drag = event;
            this._startX = this.shape.x;
            this._startY = this.shape.y;
            // console.log('target: ', event);
            this._start_br_fade();
            var self = this;

            event.addEventListener('mousemove', _.bind(this._on_mousemove, this));
            event.addEventListener('mouseup', function(){
                delete self._drag;
            })
        },

        _on_br_mousedown: function (event) {
            this._br_drag = event;
            this._start_width = this.width;
            this._start_height = this.height;

            if (this._sbfto) {
                clearTimeout(this._sbfto);
            }
            this._br_handle.visible = true;

            event.addEventListener('mousemove', _.bind(this._on_br_mousemove, this));

            event.addEventListener('mouseup', _.bind(this._start_br_fade, this));
        },

        _on_br_mousemove: function (event) {
            var dw = event.stageX - this._br_drag.stageX;
            dw -= dw % GRID_SIZE;
            this.width = this._start_width + dw;
            var dh = event.stageY - this._br_drag.stageY;
            dh -= dh % GRID_SIZE;
            this.height = this._start_height + dh;

            this.redraw_shape();
        },

        _on_mousemove: function (event) {

            if (this._sbfto) {
                clearTimeout(this._sbfto);
                this._br_handle.visible = false;
            }

            //console.log('moving', event);
            var dx = event.stageX - this._drag.stageX;
            dx -= dx % GRID_SIZE;

            var dy = event.stageY - this._drag.stageY;
            dy -= dy % GRID_SIZE;
            this.shape.x = this._startX + dx;
            this.shape.y = this._startY + dy;
            this._update_handles();
            this.stage.update();
        }
    };

    function _add_thing_part(sprite_type, thing, container, stage) {

        var shape = new createjs.Shape();
        shape.__thing_order = thing.draw_steps.length;
        new Sprite(sprite_type, thing, container, stage);
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

            var scope_ele = $('#thing_editor');
            var create_canvas = scope_ele.find('.thing_canvas')[0];

            var stage = new createjs.Stage(create_canvas);
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

                _add_thing_part(sprite_type, $scope.thing, draw_container, stage);
            }

            return {
                stage: stage
            };
        }
    });

})();
