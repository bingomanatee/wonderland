(function (window) {


    var STAGE_WIDTH = 400;
    var STAGE_HEIGHT = 400;
    var GRID_SIZE = 10;
    var MAX_A = Math.max(STAGE_WIDTH, STAGE_HEIGHT);
    var HANDLE_SIZE = 10;
    var ROT_BOX_SIZE = 10;

    function Poly_Point(thing_canvas, event) {
        this.thing_canvas = thing_canvas;
        this.$scope = thing_canvas.$scope;
        this.sprite = new createjs.Shape();
        this.set_point_position(event);
        this.sprite.graphics.f('rgb(255,255,255)').r(-5, -5, 10, 10).ef()
            .ss(1).s('rgb(204,0,0').r(-5, -5, 10, 10).es();

        thing_canvas.poly_point_container.addChild(this.sprite);

        this.sprite.addEventListener('mousedown', _.bind(this.on_mousedown, this));
        thing_canvas.us();
    }

    Poly_Point.prototype = {

        on_mousemove: function (event) {
            this.set_point_position(event);
            this.refresh();
        },

        refresh: function () {
            this.thing_canvas.redraw_polygon();
        },

        set_point_position: function (event) {
            this.x = event.stageX - (event.stageX % GRID_SIZE);
            this.y = event.stageY - (event.stageY % GRID_SIZE);
            this.sprite.x = this.x;
            this.sprite.y = this.y;
        },

        on_mousedown: function (event) {
            switch (this.$scope.poly_button_state) {
                case 'remove':
                    this.thing_canvas.remove_poly_point(this);
                    break;

                case 'move':
                    event.addEventListener('mousemove', _.bind(this.on_mousemove, this));
                    break;
            }
        }
    }

    /* ------------- Thing_Canvas class ----------------------- */

    function Thing_Canvas($scope) {
        var scope_ele = $('#thing_editor');
        var create_canvas = scope_ele.find('.thing_canvas')[0];
        this.stage = new createjs.Stage(create_canvas);
        this.thing = $scope.thing;
        this.$scope = $scope;

        this._make_click_shape();
        this._make_grid_shape();
        this._make_draw_container();
        this._make_box_container();
        this._make_poly_container();
        this._make_boxes();

        this.us();

    }

    _.extend(Thing_Canvas.prototype, {

        update_color: function (c) {
            if (c && this.current_sprite) {
                this.current_sprite.set_color(c);
                this.us();
            }
        },

        _make_boxes: function () {

            var self = this;

            this._box_hs = [
                [],
                []
            ];
            this._box_vs = [
                [],
                []
            ];

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
                            shape.x = target.edge('right');
                        } else {
                            shape.x = target.edge('left') - HANDLE_SIZE;
                        }

                        if (dim.v) {
                            shape.y = target.edge('bottom');
                        } else {
                            shape.y = target.edge('top') - HANDLE_SIZE;
                        }
                        shape.__target = target;
                    };

                    shape.addEventListener('mousedown', function (event) {
                        if (!shape.__target) return;

                        event.addEventListener('mousemove', function (evt) {

                            _.each(self._box_hs[dim.h], function (shape) {
                                shape.x = evt.stageX;
                                shape.x -= shape.x % GRID_SIZE;
                            });
                            _.each(self._box_vs[dim.v], function (shape) {
                                shape.y = evt.stageY;
                                shape.y -= shape.y % GRID_SIZE;
                            });

                            if (shape.__target) {
                                var x = Math.min(self._box_hs[1][0].x, self._box_hs[0][0].x) + HANDLE_SIZE;
                                var y = Math.min(self._box_vs[1][0].y, self._box_vs[0][0].y) + HANDLE_SIZE;

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
            if (target && target.type == 'polygon'){
                target = false;
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

        move_boxes_around_sprite: function (sprite) {
            _.each(this._box_hs, function (boxes, i) {
                _.each(boxes, function (box) {
                    switch (i) {
                        case 0:
                            box.x = sprite.container.x - HANDLE_SIZE;
                            break;

                        case 1:
                            box.x = sprite.container.x + sprite.width;
                            break;
                    }
                });
            })

            _.each(this._box_vs, function (boxes, i) {
                _.each(boxes, function (box) {
                    switch (i) {
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
            if (type === false) {
                console.log('... toggling off ');
                this.show_boxes(false);
                this.sprite_type = '';
                return;
            }
            if (!type) return;
            this.sprite_type = type;
            console.log('making new sprite of  type ... ', type);
            if (type == 'polygon') {
                this._init_polygon();
            }
            this.current_sprite = new Thing_Sprite(type, this);
        },

        _init_polygon: function () {
            this.poly_container.visible = true;
            this.$scope.poly_button_state = 'add';
            this.us();
        },

        remove_poly_point: function (point) {
            this._poly_points = _.reject(this._poly_points, function (pp) {
                return pp === point;
            });

            this.poly_point_container.removeAllChildren();
            this.poly_point_container.addChild.apply(this.poly_point_container, _.pluck(this._poly_points, 'sprite'));

            this.redraw_polygon();
        },

        remove_sprite: function () {
            if (this.current_sprite) {
                this.current_sprite.remove();
                this.current_sprite = null;
                this.show_boxes(false);
            }
        },

        move_sprite: function (dir) {
            if (this.current_sprite) {
                var sprites = this.thing.sprites;
                var current = this.current_sprite;
                var sprite_place = _.indexOf(sprites, current);
                if (sprite_place == -1) return;

                if (dir == 'up' && sprite_place == 0) return;
                if (dir == 'down' && sprite_place == sprites.length - 1) return;

                var swap_index = (dir == 'up') ? sprite_place - 1 : sprite_place + 1;

                var swap = sprites[swap_index];
                sprites[swap_index] = current;
                sprites[sprite_place] = swap;

                this.draw_container.removeAllChildren();
                this.draw_container.addChild.apply(this.draw_container,
                    _.pluck(sprites, 'container'));
                this.us();
            }
        },

        _make_draw_container: function () {
            this.draw_container = new createjs.Container();
            this.stage.addChild(this.draw_container);
        },

        redraw_polygon: function (dx, dy) {
            if (!dx) dx = 0;
            if (!dy) dy = 0;
            this.current_sprite.update_points(this._poly_points, dx, dy);
            this.current_sprite.redraw_shape();
        },

        close_poly: function(){
            this.poly_container.visible = false;
            this._poly_points = [];
            this.poly_point_container.removeAllChildren();
            this.current_sprite = null;
            this.us();
        },

        _make_poly_container: function () {
            this.poly_container = new createjs.Container();
            this.poly_catcher = new createjs.Shape();
            this.poly_catcher.addEventListener('mousedown', _.bind(this._poly_mousedown, this));

            this.poly_container.addChild(this.poly_catcher);
            this.poly_preview = new createjs.Shape();
            this.poly_container.addChild(this.poly_preview);

            this.poly_point_container = new createjs.Container();
            this.poly_container.addChild(this.poly_point_container);
            this.poly_catcher.graphics.f('rgba(255,255,204,0.1)').r(0, 0, STAGE_WIDTH, STAGE_HEIGHT).ef();
            this._poly_points = [];
            this.poly_container.visible = false;
            this.stage.addChild(this.poly_container);
        },

        _poly_mousedown: function (event) {
            if (this.$scope.poly_button_state == 'add') {
                var poly_point = new Poly_Point(this, event);
                this._poly_points.push(poly_point);
                this.redraw_polygon();
            }
        },

        _make_box_container: function () {
            this.box_container = new createjs.Container();
            this.stage.addChild(this.box_container);
        },

        _make_grid_shape: function () {
            this.grid_shape = new createjs.Shape();
            this.stage.addChild(this.grid_shape);
            var g = this.grid_shape.graphics;
            g.s('rgb(225,225,225)');

            for (var a = 0; a < MAX_A; a += GRID_SIZE) {
                g.mt(0, a).lt(STAGE_HEIGHT, a).mt(a, 0).lt(a, STAGE_WIDTH);
            }
            this.grid_shape.graphics.es();
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
            if (this.sprite_type) {
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

})
    (window);
