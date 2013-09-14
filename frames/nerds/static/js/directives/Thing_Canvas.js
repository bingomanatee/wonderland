(function (window) {


    var GRID_SIZE = 10;
    var DRAW_AREA = 400;
    var STAGE_WIDTH = DRAW_AREA + (2 * GRID_SIZE);
    var STAGE_HEIGHT = DRAW_AREA + (2 * GRID_SIZE);
    var DRAW_WIDTH = DRAW_HEIGHT = DRAW_AREA;
    var HANDLE_SIZE = 10;
    var ROT_BOX_SIZE = 10;

    var CP_X = GRID_SIZE * 8;
    var CP_Y = GRID_SIZE * 8;
    var CP_WIDTH = DRAW_AREA - CP_X * 2;
    var CP_HEIGHT = DRAW_AREA - CP_Y * 2;
    var HUES = 18;
    var SWATCH_HEIGHT = 24;
    var SHADES = 8;
    var VALUES = 8;

    var _hsl_template = _.template('hsl(<%= Math.max(0, Math.min(360, Math.round(h))) %>, <%= Math.max(0, Math.min(100, Math.round(s))) %>%, <%= Math.max(0, Math.min(100, Math.round(v))) %>%)');
    /* ***************** Color Palette ******************* */

    function Color_Palette(thing_canvas) {
        this.thing_canvas = thing_canvas;
        this.init_cp_layer();
        this.thing_canvas.stage.addChild(this.palette);
        this.show(false);
    }

    Color_Palette.prototype = {

        ld: function (hue) {
            var self = this;

            return function (event) {
                self.lighten.removeAllChildren();
                self.darken.removeAllChildren();
                var w = CP_WIDTH / VALUES;
                _.each(_.range(50, 100, 50 / VALUES), function (value, i) {
                    var x = w * i;
                    _.each([100, 50, 25, 10], function (sat, i) {
                        var swatch = self.make_swatch(hue, sat, value, x, SWATCH_HEIGHT * i, w, SWATCH_HEIGHT);
                        swatch.addEventListener('mousedown', self.color_choice(hue, 100, value));
                        self.lighten.addChild(swatch);
                    });


                    _.each([100, 50, 25, 10], function (sat, i) {
                        swatch = self.make_swatch(hue, sat, 100 - value, x, -SWATCH_HEIGHT * i, w, SWATCH_HEIGHT);
                        swatch.addEventListener('mousedown', self.color_choice(hue, 100, 100 - value));
                        self.darken.addChild(swatch);
                    });
                });
                self.us();
            }
        },

        color_choice: function (hue, sat, value) {

            return _.bind( function (event) {
                console.log('chosen hsv ', hue, sat, value);
                this.show(false);
                this.thing_canvas.$scope.current_color = (this._color_string(hue, sat, value));
                this.thing_canvas.$scope.$apply();
            }, this);

        },

        us: function () {
            this.thing_canvas.us();
        },

        init_cp_layer: function () {
            this.palette = new createjs.Container();
            this.palette.x = CP_X;
            this.palette.y = CP_Y;

            this.lighten = new createjs.Container();
            this.darken = new createjs.Container();
            this.darken.y = CP_HEIGHT - SWATCH_HEIGHT;
            this.palette.addChild(this.darken, this.lighten);

            var back = new createjs.Shape();
            back.graphics.f('rgba(200,200,200, 0.25)').r(0, 0, CP_WIDTH, CP_HEIGHT).ef().s('rgba(100,100,100,0.25)').ss(1).r(0, 0, CP_WIDTH, CP_HEIGHT).es();

            this.palette.addChild(back);
            var hue_width = CP_WIDTH / HUES;
            var y = (CP_HEIGHT ) / 2- SWATCH_HEIGHT;

            _.each(_.range(0, 360, 360 / HUES), function (hue, i) {
                var x = i * hue_width;
                var swatch = this.make_swatch(hue, 100, 50, x, y, hue_width, SWATCH_HEIGHT);
                this.palette.addChild(swatch);

                swatch.addEventListener('mousedown', this.ld(hue));
            }, this);

            y += SWATCH_HEIGHT;
            var grey_width = CP_WIDTH / (SHADES + 1);
            _.each(_.range(0, 101, 100 / SHADES), function (lightness, i) {
                var x = i * grey_width;
                var swatch = this.make_swatch(0, 0, lightness, x, y, grey_width, SWATCH_HEIGHT);
                swatch.addEventListener('mousedown', this.color_choice(0, 0, lightness));
                this.palette.addChild(swatch);
            }, this);


        },

        make_swatch: function (hue, sat, value, x, y, w, h) {

            var swatch = new createjs.Shape();
            swatch.x = x;
            swatch.y = y;
            swatch.graphics.f(this._color_string(hue, sat, value)).r(0, 0, w, h).ef();

            return swatch;
        },

        _color_string: function(h, s, v){
          var data = {h: h, s: s, v: v};
            return _hsl_template(data);
        },

        show: function (hide) {
            this.palette.visible = hide === false ? false : true;
            this.thing_canvas.us();
        }
    };

    /* ***************** Poly Point *********************** */

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
            this.x = gd(event.stageX);
            this.y = gd(event.stageY);
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
        var scope_ele = $('#things');
        var create_canvas = scope_ele.find('.thing_canvas')[0];
        create_canvas.width = STAGE_WIDTH;
        create_canvas.height = STAGE_HEIGHT;
        this.stage = new createjs.Stage(create_canvas);

        this.$scope = $scope;

        this._make_grid_shape();
        this._make_click_shape();
        this._make_draw_container();
        this._make_box_container();
        this._make_poly_container();
        this._make_boxes();
        this._init_color_palette();

        this.us();

    }

    _.extend(Thing_Canvas.prototype, {
        thing: function () {
            return this.$scope.thing;
        },

        /** initialization **************************** */

        _init_color_palette: function () {
            this.cp = new Color_Palette(this);
        },

        _init_polygon: function () {
            this.poly_container.visible = true;
            this.$scope.poly_button_state = 'add';
            this.us();
        },

        _make_grid_shape: function () {
            this.grid_shape = new createjs.Shape();
            this.grid_shape.x = this.grid_shape.y = GRID_SIZE;
            this.stage.addChild(this.grid_shape);
            var g = this.grid_shape.graphics;
            g.s('rgb(225,225,225)');

            for (var x = 0; x <= DRAW_AREA; x += GRID_SIZE) {
                g.mt(x, 0).lt(x, DRAW_AREA);
                g.mt(0, x).lt(DRAW_AREA, x);
            }

            this.grid_shape.graphics.es();
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

        _make_draw_container: function () {
            this.draw_container = new createjs.Container();
            this.draw_container.x = this.draw_container.y = GRID_SIZE;
            this.stage.addChild(this.draw_container);
        },

        /**
         * This makes a big white rectangle allowing you to click
         * and andd new sprites.
         *
         * @private
         */
        _make_click_shape: function () {

            this.click_shape = new createjs.Shape();
            this.click_shape.graphics.f('rgba(245,255,255, 0.01)').r(0, 0, STAGE_WIDTH, STAGE_HEIGHT).ef();
            this.stage.addChild(this.click_shape);

            this.click_shape.addEventListener('mousedown', _.bind(this.on_mousedown, this));
        },

        reset: function () {
            this._poly_points = [];
            this.current_sprite = null;
            this.draw_container.removeAllChildren();
            this.us();
            this.show_boxes(false);
        },

        /* *********** USER ACTION *************** */

        choose_color: function(){
            this.cp.show();
        },

        max_width: function () {
            if (this.current_sprite) {
                this.current_sprite.max_width();
                this.move_boxes_around_sprite();
            }
        },

        max_height: function () {
            if (this.current_sprite) {
                this.current_sprite.max_height();
                this.move_boxes_around_sprite();
            }
        },

        add_sprite: function (type, x, y, w, h) {
            console.log('adding type ... ', type);
            if (type === false) {
                console.log('... toggling off ');
                this.show_boxes(false);
                this.sprite_type = '';
                this.current_sprite = null;
                return;
            }
            if (!type) return;
            this.sprite_type = type;
            console.log('making new sprite of  type ... ', type);
            if (type == 'polygon') {
                this._init_polygon();
            }
            return this.current_sprite = new Thing_Sprite(type, this, x, y, w, h);
        },

        move_sprite: function (dir) {
            if (this.current_sprite) {
                var sprites = this.thing().sprites;
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

        _poly_mousedown: function (event) {
            if (this.$scope.poly_button_state == 'add') {
                var poly_point = new Poly_Point(this, event);
                this._poly_points.push(poly_point);
                this.redraw_polygon();
            }
        },

        on_mousedown: function (ev) {
            console.log('click shape mousdeown ', ev);
            var current_sprite = this.current_sprite;
            if (this.sprite_type) {
                var x = gd(ev.stageX);
                var y = gd(ev.stageY);
                var sprite;
                if (current_sprite && current_sprite.width && current_sprite.height) {
                    sprite = this.add_sprite(this.sprite_type, x, y, current_sprite.width, current_sprite.height);
                } else {
                    sprite = this.add_sprite(this.sprite_type, x, y);
                }

                sprite.container.x = x;
                sprite.container.y = y;
                this.move_boxes_around_sprite(sprite);
            }
            this.us();
        },

        redraw_polygon: function (dx, dy) {
            if (!dx) dx = 0;
            if (!dy) dy = 0;
            this.current_sprite.update_points(this._poly_points, dx, dy);
            this.current_sprite.redraw_shape();
        },

        update_color: function (c) {
            if (c && this.current_sprite) {
                this.current_sprite.set_color(c);
                this.us();
            }
        },

        clone_sprite: function () {
            if (this.current_sprite) {
                this.show_boxes(this.current_sprite = this.current_sprite.clone());
            }
        },

        close_poly: function () {
            this.poly_container.visible = false;
            this._poly_points = [];
            this.poly_point_container.removeAllChildren();
            this.current_sprite = null;
            this.us();
        },

        us: function () {
            this.stage.update();
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

        /* *********** BOXES *************** */

        _make_box_container: function () {
            this.box_container = new createjs.Container();
            this.box_container.x = this.box_container.y = GRID_SIZE;
            this.stage.addChild(this.box_container);
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
                                shape.x = gd(evt.stageX);
                            });
                            _.each(self._box_vs[dim.v], function (shape) {
                                shape.y = gd(evt.stageY);
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
            if (target && target.type == 'polygon') {
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
            if (arguments.length < 1) sprite = this.current_sprite;

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
        }
    });

    window.Thing_Canvas = Thing_Canvas;

    Thing_Canvas.STAGE_WIDTH = STAGE_WIDTH;
    Thing_Canvas.STAGE_HEIGHT = STAGE_HEIGHT;
    Thing_Canvas.DRAW_WIDTH = DRAW_WIDTH;
    Thing_Canvas.DRAW_HEIGHT = DRAW_HEIGHT;
    Thing_Canvas.GRID_SIZE = GRID_SIZE;
    Thing_Canvas.HANDLE_SIZE = HANDLE_SIZE;

    var gd = Thing_Canvas.gd = function (n) {
        return n - (n % GRID_SIZE);
    }

})
    (window);
