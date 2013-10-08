(function (window) {

    var app = angular.module('NERDS_app');

    app.factory('hex_extent', function () {

        return function (hexes) {

            var hex0 = hexes[0].points[0];

            var min_x = hex0.x;
            var max_x = min_x;
            var min_y = hex0.y;
            var max_y = min_y;

            hexes.forEach(function (hex) {
                hex.points.forEach(function (point) {

                    if (point.x < min_x) {
                        min_x = point.x;
                    } else if (point.y > max_x) {
                        max_x = point.x;
                    }

                    if (point.y < min_y) {
                        min_y = point.y;
                    } else if (point.y > max_y) {
                        max_y = point.y;
                    }
                });
            });

            return {
                min_x: min_x,
                max_x: max_x,
                width: max_x - min_x,
                min_y: min_y,
                max_y: max_y,
                height: max_y - min_y
            };


        }
    });
})(window);