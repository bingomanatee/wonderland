(function (window) {

    var STAGE_WIDTH = 400;
    var STAGE_HEIGHT = 400;
    var GRID_SIZE = 25;
    var MAX_A = Math.max(STAGE_WIDTH, STAGE_HEIGHT);
    var HANDLE_SIZE = 15;
    var ROT_BOX_SIZE = 30;
    var RBR = ROT_BOX_SIZE / 2;
    var FADE_TIME = 4000;

    function _deg_point(deg) {
        var x = ROT_BOX_SIZE / 2 * (1 + Math.cos(Math.PI * deg / 180));
        var y = ROT_BOX_SIZE / 2 * (1 + Math.sin(Math.PI * deg / 180));
        return [x, y];
    }

    function Thing_Sprite(type, thing, stage, color) {
        console.log('creating sprite with color ', color);

        if (!stage.__draw_container){
            stage.__draw_container = new createjs.Container();
            stage.addChild(stage.__draw_container);
        }

        var container = new createjs.Container();
        stage.__draw_container.addChild(container);

        this.rotation = 0;
        this.stage = stage;
        this.type = type;
        this.container = container;
        this.width = this.height = GRID_SIZE * 2;
        this.color = color;
        this.redraw_shape();

        thing.draw_steps.push(this);

        this.shape.addEventListener('mousedown', _.bind(this._on_mousedown, this));
        stage.update();
    }

    Thing_Sprite.prototype = {

        redraw_shape: function () {
            var first = false;
            if (!this.shape) {
                this.shape = new createjs.Shape();
                this.shape.__sprite = this;
                this.container.addChild(this.shape);
                first = true;
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

            if (first) {
                this._add_boxes();
            }
            this._update_handles();
            this.stage.update();
        },

        center_x: function () {
            return (this.width ) / 2;
        },

        center_y: function () {
            return (this.height ) / 2;
        },

        _draw_triangle: function () {
            switch(this.rotation % 360 - (this.rotation % 90)){
                case 0:
                    this.shape.graphics.c().f(this.color)
                        .mt(0, this.height)
                        .lt(this.width / 2, 0)
                        .lt(this.width, this.height).ef();
                    break;

                case 90:

                    this.shape.graphics.c().f(this.color)
                        .mt(0, 0)
                        .lt(this.width, this.height/2)
                        .lt(0, this.height).ef();
                    break;

                case 270:

                    this.shape.graphics.c().f(this.color)
                        .mt(this.width, 0)
                        .lt(0, this.height/2)
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

        _make_rot_box: function(){

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
            this._rotate_box.visible = false;
        },

        _make_br_box: function(){
            this._br_handle = new createjs.Shape();
            this._br_handle.graphics.f('rgba(0,0,0, 0.75').r(0, 0, HANDLE_SIZE, HANDLE_SIZE);
            this.container.addChild(this._br_handle);

            this._br_handle.addEventListener('mousedown', _.bind(this._on_br_mousedown, this));
            this._br_handle.visible = false;
        },

        _add_boxes: function () {
            this._make_br_box();
            this._make_rot_box();
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

        _start_br_fade: function () {
            if (this._sbfto) {
                clearTimeout(this._sbfto);
            }
            var self = this;
            this._br_handle.visible = true;
            self._rotate_box.visible = true;
            this.stage.update();
            this._sbfto = setTimeout(function () {
                self._br_handle.visible = false;
                self._rotate_box.visible = false;
                self.stage.update();
            }, FADE_TIME);
        },

        _update_handles: function () {
            this._br_handle.x = this.shape.x + this.width;
            this._br_handle.y = this.shape.y + this.height;
            this._rotate_box.x = this.shape.x + this.center_x() - ROT_BOX_SIZE / 2;
            this._rotate_box.y = this.shape.y + this.center_y() - ROT_BOX_SIZE / 2;
        },

        _on_mousedown: function (event) {

            this._drag = event;
            this._startX = this.shape.x;
            this._startY = this.shape.y;
            // console.log('target: ', event);
            this._start_br_fade();
            var self = this;

            event.addEventListener('mousemove', _.bind(this._on_mousemove, this));
            event.addEventListener('mouseup', function () {
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
            this._rotate_box.visible = true;

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
                this._rotate_box.visible = false;
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

    window.Thing_Sprite = Thing_Sprite;

})(window);