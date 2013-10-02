(function(){

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

})(window);