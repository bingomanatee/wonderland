(function (window) {

    var app = angular.module('NERDS_app');

    function _center(hex) {
        var center = {
            x: 0,
            y: 0
        };

        var p = 0;
        _.each(hex.points, function (pt) {
            center.x += pt.x;
            center.y += pt.y;
            ++p;
        });
        if (p > 0) {
            center.x /= p;
            center.y /= p;
        }
        return center;
    }

    /**
     * Hex coordinates are given in absolute x y points, in world units.
     * the overall container is offset to center it in the stage.
     *
     * the functions _x and _y translate input hex points into points relative to its center.
     * The hex's shape is moved to its center; all the six points are then translated into
     * offsets from its center.
     *
     * Note that the hex's center is relative to the container's offset.
     */

    app.factory('map_editor_draw_hexes', function (hex_extent) {
        var ca = false;

        function _draw_hex() {
            var color = false;
            var last_point = _.last(this.points);
            if (this.terrain_color) {
                color = this.terrain_color;
            } else {
                if (!ca) console.log('no color for hex ', this);
                ca = true;
            }
            this.shape.graphics.c();

            this.shape.graphics.f(color ? color : 'white').mt(this._x(last_point.x), this._y(last_point.y));

            _.each(this.points, function (point) {
                this.shape.graphics.lt(this._x(point.x), this._y(point.y));
            }, this);

            this.shape.graphics.ef();

            this.shape.graphics.s('rgba(0,0,0,0.125').mt(this._x(last_point.x), this._y(last_point.y));

            _.each(this.points, function (point) {
                this.shape.graphics.lt(this._x(point.x), this._y(point.y));
            }, this);

            this.shape.graphics.es();
        }

        function _draw_city(city_container, hex) {


            return function () {
                if (!hex.city_shape) {
                    hex.city_shape = new createjs.Shape();
                    city_container.getChildByName('cities').addChild(hex.city_shape);
                    hex.city_label_shape = new createjs.Text(hex.city.name, '10px Arial', 'black');
                    city_container.getChildByName('labels').addChild(hex.city_label_shape);
                }

                hex.city_shape.x = hex.city_label_shape.x = hex.shape.x;
                hex.city_shape.y = hex.city_label_shape.y = hex.shape.y;
                hex.city_label_shape.x += hex.height() * 0.5;
                hex.city_label_shape.y -= hex.height() * 0.25;

                hex.city_shape.graphics.c().f('rgba(0,0,0,0.25').dc(0, 0, hex.height() / 3).ef();
            }
        }


        return  function (hexes, hex_container, city_container, map_container, canvas) {
            hex_container.removeAllChildren();

            var extent = hex_extent(hexes);
            console.log('extent: ', extent);

            var width_ratio = canvas.width / extent.width;
            var height_ratio = canvas.height / extent.height;
            var ratio = Math.min(width_ratio, height_ratio);

            if (width_ratio > height_ratio) {
                map_container.x = (canvas.width - (extent.width * ratio)) / 2;
            } else {
                map_container.y = (canvas.height - (extent.height * ratio)) / 2;
            }

            _.each(hexes, function (hex) {
                if (!hex) return;
                if (!hex.center) {
                    hex.center = _center(hex);
                }

                hex.shape = new createjs.Shape();

                hex.height = function () {
                    var ys = _.pluck(hex.points, 'y');
                    var min_y = _.min(ys);
                    var max_y = _.max(ys);
                    return hex._y(max_y) - hex._y(min_y);
                };

                hex._x = _x;
                hex._y = _y;

                hex.shape.x = _x(hex.center.x);
                hex.shape.y = _y(hex.center.y);


                function _x(x) {
                    return (x - extent.min_x) * ratio - hex.shape.x;
                }

                function _y(y) {
                    return (y - extent.min_y) * ratio - hex.shape.y;
                }

                hex.draw = _draw_hex;

                hex.draw_city = _draw_city(city_container, hex);

                hex.draw();

                hex_container.addChild(hex.shape);
            });

            console.log('done drawing hexes');
        };
    });

})(window);