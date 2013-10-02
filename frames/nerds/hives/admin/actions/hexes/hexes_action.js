var hexagony = require('hexagony');
var _ = require('underscore');

module.exports = {

    on_process: function (context, done) {
        var params = {
            hex_size: context.hex_size,
            map_size: context.map_size
        };

        var hexes = hexagony.make_hexes(params);

        var hex_data = _.flatten(hexes).map(function (hex) {
            return {
                row: hex.row,
                column: hex.column,
                center: { x: hex.x(),  y: hex.y() },
                points: hex.points.map(function (point) {
                    return {x: point.x(), y: point.y()}
                })
            };
        })

        context.hex_data = hex_data;
        done();
    },

    on_output: function(context, done){
        context.$send(context.hex_data, done);
    }

};