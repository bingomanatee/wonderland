(function (window) {

    var app = angular.module('NERDS_app');

    app.factory('hex_size', function () {

        return  function hex_size(map_size, hex_scale) {
            var hex_power = 0;
            while (Math.pow(10, hex_power) < map_size) ++hex_power;
            --hex_power;
            return Math.pow(10, hex_power) * hex_scale;
        }
    });
})(window);