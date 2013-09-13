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

        this.thing_canvas.thing.sprites.push(this);

        this.shape.addEventListener('mousedown', _.bind(this._on_mousedown, this));
        this.thing_canvas.show_boxes(this);
        this.update();
    }

    Thing_Sprite.prototype = {

        set_color: function (color) {
            this.color = color;
            this.redraw_shape();
        },

        remove: function(){
          this.thing_canvas.thing.sprites = _.reject (this.thing_canvas.thing.sprites, function(ele){
              return ele === this;
          }, this);

            this.thing_canvas.draw_container.removeChild(this.container);
            this.update();
        },

        edge: function (which) {
            switch (which) {
                case 'right':
                    return this.container.x + this.width;
                    break;

                case 'left':
                    return this.container.x;
                    break;

                case 'top':
                    return this.container.y;
                    break;

                case 'bottom':
                    return this.container.y + this.height;
                    break;

                default:
                    throw new Error('cannot recognize edge ' + which);
            }
        },

        update_points: function(points, dx, dy){
          this._points = points.map(function(point){
             var pxy = _.pick(point, 'x', 'y');
              pxy.x += dx;
              pxy.y += dy;
              return pxy;
          });
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

                case 'polygon':
                    this.container.x = this.container.y = 0;
                    this.shape.graphics.f(this.color);
                    _.each(  this._points, function(point, index){
                        if (index == 0){
                            this.shape.graphics.mt(point.x, point.y);
                        } else {
                            this.shape.graphics.lt(point.x, point.y);
                        }
                    }, this);
                    this.shape.graphics.ef();
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

        _on_mousemove: function (event) {

            this.thing_canvas.show_boxes(this);

            //  console.log('moving', event);
            var dx = event.stageX - this._drag.stageX;
            dx -= dx % Thing_Canvas.GRID_SIZE;

            var dy = event.stageY - this._drag.stageY;
            dy -= dy % Thing_Canvas.GRID_SIZE;

            //  console.log('moving', event);
            if (this.type == 'polygon'){
                this.container.x = this._startX + dx;
                this.container.y = this._startY + dy;
                this.update();
            }
        },

        update: function () {
            this.thing_canvas.us();
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
                if (self.type == 'polygon'){
                    self.update_points(self._points, self.container.x, self.container.y);
                    self.container.x = self.container.y = 0;
                }
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