(function () {

    var app = angular.module('NERDS_app');

    app.factory('easel_import', function ($http) {
        return function easel_import(id, callback) {

            function _render_rectangle(shape, token_data) {
                shape.graphics.f(token_data.color).dr(0, 0, token_data.w, token_data.h).ef();
            }

            function _render_oval(shape, token_data) {
                var diameter = Math.min(token_data.w, token_data.h);
                var rad = diameter / 2;
                shape.graphics.f(token_data.color).dc(token_data.w / 2, token_data.h / 2, rad).ef();
                if (token_data.w > token_data.h) {
                    shape.scaleX = token_data.w / token_data.h
                } else if (token_data.w < token_data.h) {
                    shape.scaleY = token_data.h / token_data.w
                }
            }

            function _render_polygon(shape, token_data) {
                shape.graphics.f(token_data.color);
                var points = [];

                while (token_data.points.length) {
                    var x = token_data.points.shift() + token_data.w / 2;
                    var y = token_data.points.shift() + token_data.h / 2;
                    points.push({x: x, y: y});
                }

                _.each(points, function (point, i) {
                    if (i) {
                        shape.graphics.lt(point.x, point.y);
                    } else {
                        shape.graphics.mt(point.x, point.y);
                    }
                });

                shape.graphics.ef();
            }

            function _render_triangle(shape, token_data) {
                shape.graphics.f(token_data.color).mt(0, token_data.h).lt(token_data.w / 2, 0).lt(token_data.w, token_data.h).ef();
            }


            function _render_shapes(data) {
                var parent = new createjs.Container();

                _.each(data.shapes, function (shape_info) {
                    var token_data = data.tokens[shape_info.token];

                    if (!token_data) {
                        throw new Error('no token data');
                    } else if (!token_data.shape_type) {
                        throw new Error('bad shape type');
                    }

                    if (token_data.shape_type == 'group') {
                        var container = new createjs.Container();

                        container.x = shape_info.x;
                        container.y = shape_info.y;
                        var r_container = new createjs.Container();
                        container.addChild(r_container);
                        r_container.x = token_data.w / 2;
                        r_container.y = token_data.h / 2;
                        var r2 = new createjs.Container();
                        r_container.addChild(r2);
                        r2.x = -token_data.w / 2;
                        r2.y = -token_data.h / 2;
                        r_container.rotation = shape_info.r;
                        container.scaleX = shape_info.scaleX;
                        container.scaleY = shape_info.scaleY;

                        parent.addChild(container);
                        return _render_shapes(token_data.shapes, r2);
                    }

                    var shape = new createjs.Shape();
                    shape.x = shape_info.x + token_data.w / 2;
                    shape.y = shape_info.y + token_data.h / 2;
                    shape.regX = token_data.w / 2;
                    shape.regY = token_data.h / 2;

                    shape.rotation = shape_info.r;
                    parent.addChild(shape);

                    switch (token_data.shape_type) {
                        case 'rectangle':
                            _render_rectangle(shape, token_data);
                            break;

                        case 'oval':
                            _render_oval(shape, token_data);
                            break;

                        case 'polygon':
                            _render_polygon(shape, token_data);
                            break;

                        case 'triangle':
                            _render_triangle(shape, token_data);
                            break;

                        default:
                            throw new Error('strange type: ' + token_data.type);
                    }
                });

                return parent;
            }

            function _render_drawing(data) {

                _.each(data.tokens, function (token) {
                    token.color = data.clut[token.color];
                });

                return _render_shapes(data);
            }

            $http({
                method: 'GET',
                url: '/art/rest/drawings/' + id
            }).success(function (data) {
                    callback(null, _render_drawing(data));
                });

        }
    });
})(window);