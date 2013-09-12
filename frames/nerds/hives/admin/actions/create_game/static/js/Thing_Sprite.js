(function (window) {

    var ROT_BOX_SIZE = 30;
    var RBR = ROT_BOX_SIZE / 2;

    function _deg_point(deg) {
        var x = ROT_BOX_SIZE / 2 * (1 + Math.cos(Math.PI * deg / 180));
        var y = ROT_BOX_SIZE / 2 * (1 + Math.sin(Math.PI * deg / 180));
        return [x, y];
    }

    function Thing_Sprite(type, thing_canvas) {
        this.thing_canvas = thing_canvas;
        this.container = new createjs.Container();
        this.container.x = Thing_Canvas.STAGE_WIDTH / 2;
        this.container.x -= this.container.x % Thing_Canvas.GRID_SIZE;
        this.container.y = Thing_Canvas.STAGE_HEIGHT / 2;
        this.container.y -= this.container.x % Thing_Canvas.GRID_SIZE;

        this.thing_canvas.draw_container.addChild(this.container);

        this.rotation = 0;
        this.type = type;
        this.width = this.height = Thing_Canvas.GRID_SIZE * 2;
        this.color = this.thing_canvas.$scope.current_color;
        this.redraw_shape();

        this.thing_canvas.$scope.thing.draw_steps.push(this);

        this.shape.addEventListener('mousedown', _.bind(this._on_mousedown, this));
        this.thing_canvas.show_boxes(this);
        this.update();
    }

    Thing_Sprite.prototype = {

        set_color: function (color) {
            this.color = color;
            this.redraw_shape();
        },

        redraw_shape: function () {
            if (!this.shape) {
                this.shape = new createjs.Shape();
                this.shape.__sprite = this;
                this.container.addChild(this.shape);
            } else {
                this.shape.graphics.c();
            }

            switch (this.type) {
                case 'rectangle':
                    this.shape.graphics.f(this.color).r(0, 0, this.width, this.height).ef();
                    break;

                case 'circle':
                    var radius = Math.min(this.width, this.height) / 2;

                    this.shape.graphics.f(this.color).drawCircle(this.width / 2, this.height / 2, radius).ef();
                    break;

                case 'triangle':
                    this._draw_triangle();
                    break;
            }

            this.update();
        },

        set_width: function (width) {
            this.width = width;
            return this;
        },

        set_height: function (height) {
            this.height = height;
            return this;
        },

        set_x: function (x) {
            this.container.x = x;
            return this;
        },

        set_y: function (y) {
            this.container.y = y;
            return this;
        },

        center_x: function () {
            return (this.width ) / 2;
        },

        center_y: function () {
            return (this.height ) / 2;
        },

        _draw_triangle: function () {
            switch (this.rotation % 360 - (this.rotation % 90)) {
                case 0:
                    this.shape.graphics.c().f(this.color)
                        .mt(0, this.height)
                        .lt(this.width / 2, 0)
                        .lt(this.width, this.height).ef();
                    break;

                case 90:

                    this.shape.graphics.c().f(this.color)
                        .mt(0, 0)
                        .lt(this.width, this.height / 2)
                        .lt(0, this.height).ef();
                    break;

                case 270:

                    this.shape.graphics.c().f(this.color)
                        .mt(this.width, 0)
                        .lt(0, this.height / 2)
                        .lt(this.width, this.height).ef();
                    break;

                case 180:
                    this.shape.graphics.c().f(this.color)
                        .mt(0, 0)
                        .lt(this.width / 2, this.height)
                        .lt(this.width, 0).ef();
                    break;

                default:

            }
        },
        /*
         _make_rot_box: function () {

         this._rotate_box = new createjs.Shape();
         this._rotate_box.addEventListener('mousedown', _.bind(this._rotate, this));

         this.container.addChild(this._rotate_box);
         var g = this._rotate_box.graphics;
         g.f('rgb(255,255,255)').dc(RBR, RBR, RBR).ef();
         g.ss(1, 'round').s('rgb(204,0,0)');
         var deg = 360;
         g.mt.apply(g, _deg_point(deg));
         while (deg >= 135) {
         g.lt.apply(g, _deg_point(deg));
         deg -= 10;
         }
         g.es();

         g.f('rgb(204,0,0)').mt(RBR, RBR).lt(ROT_BOX_SIZE, RBR).lt(ROT_BOX_SIZE * 0.75, ROT_BOX_SIZE).ef();
         },

         _make_br_box: function () {
         this._br_handle = new createjs.Shape();
         this._br_handle.graphics.f('rgba(0,0,0, 0.75').r(0, 0, HANDLE_SIZE, HANDLE_SIZE);
         this.container.addChild(this._br_handle);

         this._br_handle.addEventListener('mousedown', _.bind(this._on_br_mousedown, this));
         },

         _make_x_box: function () {
         this._x_box = new createjs.Shape();
         this._x_box.graphics.f('rgb(255,0,0)').r(0, 0, HANDLE_SIZE, HANDLE_SIZE).ef();
         this._x_box.graphics.s('rgb(255,255,255)').ss(2, 'round').mt(2, 2).lt(HANDLE_SIZE - 2, HANDLE_SIZE - 2).es();
         this.container.addChild(this._x_box);
         },

         _add_boxes: function () {
         this._make_br_box();
         this._make_rot_box();
         this._make_x_box();
         this.show_boxes(false);

         this._boxes = [
         this._br_handle,
         this._x_box,
         this._rotate_box];

         this._update_handles();
         },

         _rotate: function () {
         this.rotation += 90;
         var w = this.width;
         this.width = this.height;
         this.height = w;

         switch (this.type) {
         case 'rectangle':

         break;

         case 'circle':
         break;

         case 'triangle':
         //@todo: deal with triangle rotation;
         break;
         }
         this.redraw_shape();
         this._start_br_fade();
         },

         _on_br_mousedown: function (event) {
         this._br_drag = event;
         this._start_width = this.width;
         this._start_height = this.height;

         if (this._sbfto) {
         clearTimeout(this._sbfto);
         }
         this.show_boxes(true);

         event.addEventListener('mousemove', _.bind(this._on_br_mousemove, this));

         event.addEventListener('mouseup', _.bind(this._start_br_fade, this));
         },

         _on_br_mousemove: function (event) {
         var dw = event.stageX - this._br_drag.stageX;
         dw -= dw % Thing_Canvas.GRID_SIZE;
         this.width = this._start_width + dw;
         var dh = event.stageY - this._br_drag.stageY;
         dh -= dh % Thing_Canvas.GRID_SIZE;
         this.height = this._start_height + dh;

         this.redraw_shape();
         },

         show_boxes: function (show) {
         show = !!show;
         _.each(this._boxes, function (box) {
         box.visible = show;
         });
         this.thing_canvas.stage.update();
         },

         _start_br_fade: function () {
         if (this._sbfto) {
         clearTimeout(this._sbfto);
         }
         var self = this;
         this.show_boxes(true);
         this.thing_canvas.stage.update();
         this._sbfto = setTimeout(function () {
         self.show_boxes(false);
         self.stage.update();
         }, FADE_TIME);
         },

         _update_handles: function () {
         this._br_handle.x = this.shape.x + this.width;
         this._br_handle.y = this.shape.y + this.height;
         this._rotate_box.x = this.shape.x + this.center_x() - ROT_BOX_SIZE / 2;
         this._rotate_box.y = this.shape.y + this.center_y() - ROT_BOX_SIZE / 2;
         }, */

        _on_mousemove: function (event) {
            this.thing_canvas.show_boxes(this);

            //  console.log('moving', event);
            var dx = event.stageX - this._drag.stageX;
            dx -= dx % Thing_Canvas.GRID_SIZE;

            var dy = event.stageY - this._drag.stageY;
            dy -= dy % Thing_Canvas.GRID_SIZE;

            //  console.log('moving', event);
            this.container.x = this._startX + dx;
            this.container.y = this._startY + dy;
            this.update();
        },

        update: function () {
            this.thing_canvas.stage.update();
        },

        _on_mousedown: function (event) {

            this._drag = event;
            // console.log('target: ', event);
            this._startX = this.container.x;
            this._startY = this.container.y;
            this.thing_canvas.show_boxes(this);
            this.thing_canvas.current_sprite = this;
            var self = this;

            event.addEventListener('mousemove', _.bind(this._on_mousemove, this));
            event.addEventListener('mouseup', function () {
                delete self._drag;
                //  self.thing_canvas.show_boxes(false);
            })
        },
        /*
         _on_br_mousemove: function (event) {

         if (this._sbfto) {
         clearTimeout(this._sbfto);
         this.show_boxes(false);
         }

         console.log('moving', event);
         var dx = event.stageX - this._drag.stageX;
         dx -= dx % Thing_Canvas.GRID_SIZE;

         var dy = event.stageY - this._drag.stageY;
         dy -= dy % Thing_Canvas.GRID_SIZE;

         console.log('moving', event);
         this.container.x = this._startX + dx;
         this.container.y = this._startY + dy;
         this.thing_canvas.stage.update();
         }*/
    };

    window.Thing_Sprite = Thing_Sprite;

})(window);