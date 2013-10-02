(function (window) {
    var app = angular.module('Paint');
    app.factory('Import_Drawing', function (drawings, Paint_Manager_Shape) {

        console.log('pms: ', Paint_Manager_Shape);

        return function (drawing_id, manager) {

            console.log('loading drawing ', drawing_id, 'into', manager);
            drawings.get({_id: drawing_id}, function (drawing) {
                console.log('loading drawing ', drawing);

                function _make_shape(shape_info) {
                    var token_data = drawing.tokens[shape_info.token];
                    var shape;
                    switch (token_data.shape_type) {
                        case 'polygon':
                            var points = [];

                            while (token_data.points.length) {
                                var x = token_data.points.shift();
                                var y = token_data.points.shift();
                                points.push({x: x, y: y});
                            }

                            shape = Paint_Manager_Shape(manager, token_data.shape_type, points);
                            shape.set_color(token_data.color);
                            break;

                        case 'group':
                            var shapes = _.map(token_data.shapes, _make_shape);
                            shape =  Paint_Manager_Shape(manager, token_data.shape_type, shapes);
                            shape.draw();
                            break;

                        default:
                            shape = Paint_Manager_Shape(manager, token_data.shape_type);
                            shape.set_color(token_data.color);
                    }
                    shape.set_x(shape_info.x);
                    shape.set_y(shape_info.y);
                    shape.set_rotation(shape_info.r);
                    shape.set_width(token_data.w);
                    shape.set_height(token_data.h);
                    shape.draw();

                    return shape;
                }

                if (drawing) {

                    _.each(drawing.tokens, function (token_data) {
                        token_data.color = drawing.clut[token_data.color];
                    });

                    _.each(drawing.shapes, function (shape_info) {
                        var shape = _make_shape(shape_info);
                        manager.shapes.push(shape);
                    });

                    manager.shapes_to_dc();

                    console.log('imported manager: ', manager);
                }

            })
        };
    });

})(window);