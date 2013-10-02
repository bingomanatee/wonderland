(function (window) {

    var app = angular.module('Paint');
    app.factory('Export_Drawing', function () {

            function _pack_color(c) {
                return c.replace(/[\s]+/g, '');
            }

            function _colors(shape) {
                var c = [];

                if (_.isArray(shape)) {
                    c = _.map(shape, function (shape) {
                        return _colors(shape);
                    });
                } else if (shape.type == 'group') {
                    c = _colors(shape.shapes);
                } else {
                    c = [shape.get_color()];
                }

                var out = _.uniq(_.flatten(c)).map(function (c) {
                    return _pack_color(c);
                });
                return _.uniq(out);
            }

            function _shape_to_data(shape) {
                var shape_data = {
                    type: shape.type,
                    r: shape.get_rotation(),
                    x: shape.get_x(),
                    y: shape.get_y(),
                    w: shape.get_width(),
                    h: shape.get_height(),
                    scaleX: 1,
                    scaleY: 1
                };


                switch (shape.type) {
                    case 'group':
                        shape_data.shapes = shape.shapes.map(_shape_to_data);
                        shape_data.scaleX = shape.container.scaleX;
                        shape_data.scaleY = shape.container.scaleY;
                        break;

                    case 'polygon':
                        shape_data.points = shape.points.reduce(function (out, point) {
                            out.push(point.x || 0);
                            out.push(point.y || 0);
                            return out;
                        }, []);
                        shape_data.color = shape.get_color();
                        break;

                    default:
                        shape_data.color = shape.get_color();
                }

                return shape_data;
            }

            function _map_color(data, clut) {
                if (data.color) {
                    var c = _pack_color(data.color);
                    data.color = _.indexOf(clut, c);
                } else if (data.shapes) {
                    _.each(data.shapes, function (shape) {
                        _map_color(shape, clut);
                    })
                }
            }

            function _tokenize(shape_data, tokens) {

                if (shape_data.shapes) {
                    _.each(shape_data.shapes, function (shape) {
                        _tokenize(shape, tokens);
                    })
                }
                var token = _.pick(shape_data, 'type', 'color', 'w', 'h', 'points', 'shapes');

                var ti = tokens.reduce(function (out, tt, i) {
                    if (out != -1) {
                        return out;
                    }

                    if (_.isEqual(tt, token)) {
                        return i;
                    } else {
                        return -1;
                    }
                }, -1);

                console.log('token:', token, 'index: ', ti);
                if (ti == -1) {
                    ti = tokens.length;
                    tokens.push(token);
                }
                delete shape_data.type;
                delete shape_data.color;
                delete shape_data.w;
                delete shape_data.h;
                delete shape_data.points;
                delete shape_data.shapes;
                shape_data.token = ti;
            }

            return function (manager) {

                console.log('exporting manager: ', manager);

                var out = {
                    clut: _colors(manager.shapes),
                    shapes: [],
                    tokens: []
                };

                _.each(manager.shapes, function (shape) {
                    var data = _shape_to_data(shape, out);
                    _map_color(data, out.clut);

                    _tokenize(data, out.tokens);
                    out.shapes.push(data);
                });


                return out;

            };

        }

    )
    ;


})
    (window);