(function (window) {


    var STAGE_WIDTH = 400;
    var STAGE_HEIGHT = 400;
    var GRID_SIZE = 25;
    var MAX_A = Math.max(STAGE_WIDTH, STAGE_HEIGHT);
    var HANDLE_SIZE = 25;
    var ROT_BOX_SIZE = 10;

    function _gdx(x, evt){
        var d = evt.stageX - x;
        return d - (d % GRID_SIZE);
    }
    function _gdy(y, evt){
        var d = evt.stageY - y;
        return d - (d % GRID_SIZE);
    }

    window._gdx = _gdx;
    window._gdy = _gdy;

    /* ------------- Thing_Canvas class ----------------------- */

    function Thing_Canvas($scope) {
        var scope_ele = $('#thing_editor');
        var create_canvas = scope_ele.find('.thing_canvas')[0];
        this.stage = new createjs.Stage(create_canvas);
        this.thing = $scope.thing;
        this.$scope = $scope;

        this._make_click_shape();
        this._make_grid();

        this._make_draw_container();

        this._make_box_container();
        this._make_boxes();

        this.us();

    }

    _.extend(Thing_Canvas.prototype, {

        update_color: function(c){
            if (c && this.current_sprite){
                this.current_sprite.set_color(c);
                this.us();
            }
        },

        _make_boxes: function () {

            var self = this;

            this._box_hs = [[], []];
            this._box_vs = [[], []];

            this._boxes = _.map(
                [
                    {h: 0, v: 0},
                    {h: 1, v: 0},
                    {h: 0, v: 1},
                    {h: 1, v: 1}
                ], function (dim) {
                    var shape = new createjs.Shape();
                    this.box_container.addChild(shape);
                    this._box_hs[dim.h].push(shape);
                    this._box_vs[dim.v].push(shape);

                    shape.graphics.f('rgba(0,0,0,0.66)').r(0, 0, HANDLE_SIZE, HANDLE_SIZE).es();
                    shape.__move_around = function (target) {
                        if (dim.h) {
                            shape.x = target.container.x + target.width;
                        } else {
                            shape.x = target.container.x - HANDLE_SIZE;
                        }

                        if (dim.v) {
                            shape.y = target.container.y + target.height;
                        } else {
                            shape.y = target.container.y - HANDLE_SIZE;
                        }
                        shape.__target = target;
                    };

                    shape.addEventListener('mousedown', function (event) {
                        if (!shape.__target) return;

                        event.addEventListener('mousemove', function (evt) {

                            _.each(self._box_hs[dim.h], function(shape){
                                shape.x = evt.stageX;
                                shape.x -= shape.x % GRID_SIZE;
                            });
                            _.each(self._box_vs[dim.v], function(shape){
                                shape.y = evt.stageY;
                                shape.y -= shape.y % GRID_SIZE;
                            });

                            if (shape.__target){
                                var x = Math.min(self._box_hs[1][0].x , self._box_hs[0][0].x) + HANDLE_SIZE;
                                var y = Math.min(self._box_vs[1][0].y , self._box_vs[0][0].y) + HANDLE_SIZE;

                                var width = Math.abs(self._box_hs[1][0].x - self._box_hs[0][0].x - HANDLE_SIZE);
                                var height = Math.abs(self._box_vs[1][0].y - self._box_vs[0][0].y - HANDLE_SIZE);
                                shape.__target.set_width(width).set_height(height).set_x(x).set_y(y).redraw_shape();
                            }

                            self.us();
                        });

                    });

                    return shape;

                }, this);

            this.show_boxes(false);
        },

        show_boxes: function (target) {
            if (target) {
                this.target = target;
            }

            if (target === false) {
                _.each(this._boxes, function (box) {
                    box.visible = false;
                });
            } else {

                _.each(this._boxes, function (box) {
                    box.visible = true;
                    box.__move_around(this.target);
                }, this)
            }

            this.us();
        },

        move_boxes_around_sprite: function(sprite){
            _.each(this._box_hs, function(boxes, i){
                _.each(boxes, function(box){
                    switch(i){
                        case 0:
                            box.x = sprite.container.x - HANDLE_SIZE;
                            break;

                        case 1:
                            box.x = sprite.container.x + sprite.width;
                            break;
                    }
                });
            })

            _.each(this._box_vs, function(boxes, i){
                _.each(boxes, function(box){
                    switch(i){
                        case 0:
                            box.y = sprite.container.y - HANDLE_SIZE;
                            break;

                        case 1:
                            box.y = sprite.container.y + sprite.height;
                            break;
                    }
                });
            })

            this.us();
        },

        us: function () {
            this.stage.update();
        },

        add_sprite: function (type) {
            console.log('adding type ... ', type);
            if (type === false){
                console.log('... toggling off ');
                this.show_boxes(false);
                this.sprite_type = '';
                return;
            }
            if (!type) return;
            console.log('making new sprite of  type ... ', type);
            this.sprite_type = type;
            return this.current_sprite = new Thing_Sprite(type, this);
        },

        _make_draw_container: function () {
            this.draw_container = new createjs.Container();
            this.stage.addChild(this.draw_container);
        },
        _make_box_container: function () {
            this.box_container = new createjs.Container();
            this.stage.addChild(this.box_container);
        },

        _make_grid: function () {
            this.grid = new createjs.Shape();
            this.stage.addChild(this.grid);
            this.grid.graphics.s('rgb(225,225,225)');

            for (var a = 0; a < MAX_A; a += GRID_SIZE) {
                this.grid.graphics.mt(0, a).lt(STAGE_HEIGHT, a);
                this.grid.graphics.mt(a, 0).lt(a, STAGE_WIDTH)

            }
            this.grid.graphics.es();
        },

        /**
         * This makes a big white rectangle allowing you to click
         * and andd new sprites.
         *
         * @private
         */
        _make_click_shape: function () {

            this.click_shape = new createjs.Shape();
            this.click_shape.graphics.f('rgb(245,255,255)').r(0, 0, STAGE_WIDTH, STAGE_HEIGHT).ef();
            this.stage.addChild(this.click_shape);

            this.click_shape.addEventListener('mousedown', _.bind(this.on_mousedown, this));
        },

        on_mousedown: function (ev) {
            if (this.sprite_type){
                var sprite = this.add_sprite(this.sprite_type);
                sprite.container.x = ev.stageX - (ev.stageX % GRID_SIZE);
                sprite.container.y = ev.stageY - (ev.stageY % GRID_SIZE);
                this.move_boxes_around_sprite(sprite);
            }
            this.stage.update();
        }
    });

    window.Thing_Canvas = Thing_Canvas;

    Thing_Canvas.STAGE_WIDTH = STAGE_WIDTH;
    Thing_Canvas.STAGE_HEIGHT = STAGE_HEIGHT;
    Thing_Canvas.GRID_SIZE = GRID_SIZE;
    Thing_Canvas.HANDLE_SIZE = HANDLE_SIZE;

})(window);
