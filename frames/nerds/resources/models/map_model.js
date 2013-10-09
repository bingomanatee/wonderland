var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var Mongoose_Model = require('hive-model-mongoose');
var Q = require('q');

var get_map = require('./lib/maps/get_map');

/* ************************************
 * creates or retrieves a set of hexagonal maps
 * to represent a flat place on the earth -- from a city to a world. 
 * Note, at this point, no lat/lon coordinates are inferred by the map - just relative distances. 
 * ************************************ */

/* ******* CLOSURE ********* */

var maps_schema = require(path.resolve(__dirname, 'schema/maps_schema.json'));
var deferred = Q.defer();
var model;

var FIELDS = ['name', 'game', 'description', 'active', 'hex_size', 'map_size', 'hexes', 'roads'];
function _pick(obj) {
    var sub = _.pick(obj, FIELDS);
    if (obj.red && obj.green && obj.blue) {
        sub.color = _.pick(obj, 'red', 'green', 'blue');
    }
    return sub;
}

/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {
    if (model){
      return  cb(null, model);
    }
    var listening = false;

    function _get_game(map, callback){
        Q.when(apiary.model('nerds_games'), function (maps_model) {
            maps_model.get(map.game, callback);
        });
    }

    function _make_model(){
        var mongoose = apiary.get_config('nerds_mongoose');
        Mongoose_Model(
            {
                name: 'nerds_maps',
                get_map: get_map,
                map_game: _get_game,
                pick: _pick
            },

            {
                mongoose: mongoose,
                schema_def: maps_schema
            },

            apiary.dataspace,

            function (err, places_model) {
                model = places_model;
                deferred.resolve(model);
            });
    }

    function listen_for_nerds_mongoose (name, err){
        if (name == 'nerds_mongoose_connect'){
            apiary.removeListener('mixin', listen_for_nerds_mongoose);
            _make_model();
        }
    }

    function checkForNerdsMongoose() {
        console.log('checkForNerdsMongoose....');

        if (apiary.has_config('nerds_mongoose')) {
            _make_model()
        } else if (!listening) {
            listen = true;
            apiary.on('mixin', listen_for_nerds_mongoose);
        }
    }

    checkForNerdsMongoose();
    return cb(null, deferred);

};