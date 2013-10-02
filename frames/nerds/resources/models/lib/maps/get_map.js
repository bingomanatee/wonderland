var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var hexagony = require('hexagony');

/* ------------ CLOSURE --------------- */


var DEFAULT_MAP_SIZE = 10 * 1000; // 10 km == 10,000 m

function _hex_size(map_size) {

    var hex_power = 0;
    while (Math.pow(10, hex_power) < map_size) ++hex_power;
    --hex_power;
    return Math.pow(10, hex_power);
}

function _generate_hexes(map, params) {
    var hexes = hexagony.make_hexes(map);

    return hexes.map(function (hex) {
        return {
            row: hex.row,
            column: hex.column,
            center: { x: hex.x(),  y: hex.y() },
            points: hex.points.map(function (point) {
                return {x: point.x(), y: point.y()}
            })
        };
    })
}

/** ********************
 * Purpose: retrieve or generate a map
 * @return void
 */

function get_map(params, callback) {
    var self = this;

    if (!params.game) {
        return callback(new Error('no game specified'));
    }
    var query = { game: params.game, name: params.name || 'world'  };

    self.find_one(query, function (err, map) {
        if (err) {
            callback(err);
        } else if (map) {
            callback(null, map);
        } else {
            map = _.clone(query);

            map.map_size = query.map_size || DEFAULT_MAP_SIZE;
            map.hex_size = _hex_size(map.hex_size);
            map.hexes = _generate_hexes(map, params);
            self.put(map, callback);
        }
    });
}

/* -------------- EXPORT --------------- */

module.exports = get_map;