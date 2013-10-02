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



/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {
    var listening = false;
    function checkForNerdsMongoose() {
        if (apiary.has_config('nerds_mongoose')) {

        } else if (!listening) {
            listen = true;
            function listen_for_nerds_mongoose (name, err){
              //  console.log('mixin: %s', name);
                if (name == 'nerds_mongoose_connect'){
                    apiary.removeListener('mixin', listen_for_nerds_mongoose);
                    var mongoose = apiary.get_config('nerds_mongoose');
                    Mongoose_Model(
                        {
                            name: 'nerds_maps',
                            get_map: get_map,
                        },

                        {
                            mongoose: mongoose,
                            schema_def: maps_schema
                        },

                        apiary.dataspace,

                        function (err, places_model) {
                            model = places_model;

                        });
                }
            }

            apiary.on('mixin', listen_for_nerds_mongoose);
        }
    }

    checkForNerdsMongoose();
    return cb(null, deferred);

}; // end export function