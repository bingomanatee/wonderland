var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var Mongoose_Model = require('hive-model-mongoose');
var Q = require('q');

/* ************************************
 * creates or retrieves a set of hexagonal terrain_types
 * to represent a flat place on the earth -- from a city to a world. 
 * Note, at this point, no lat/lon coordinates are inferred by the map - just relative distances. 
 * ************************************ */

/* ******* CLOSURE ********* */

var terrain_types_schema = require(path.resolve(__dirname, 'schema/terrain_types_schema.json'));
var FIELDS = _.keys(terrain_types_schema);
FIELDS.push('_id');

var deferred = Q.defer();
var model;


/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {
    var listening = false;

    function checkForNerdsMongoose() {
        if (apiary.has_config('nerds_mongoose')) {

        } else if (!listening) {
            listen = true;
            function listen_for_nerds_mongoose(name, err) {
                //  console.log('mixin: %s', name);
                if (name == 'nerds_mongoose_connect') {
                    apiary.removeListener('mixin', listen_for_nerds_mongoose);
                    var mongoose = apiary.get_config('nerds_mongoose');
                    Mongoose_Model(
                        {
                            name: 'nerds_terrain_types',
                            pick: function (obj) {
                                //  console.log('getting statics from %s with %s', util.inspect(obj), util.inspect(FIELDS));
                                var sub = _.pick(obj, FIELDS);
                                if (obj.red && obj.green && obj.blue) {
                                    sub.color = _.pick(obj, 'red', 'green', 'blue');
                                }
                                console.log('sub obj: %s', util.inspect(sub));
                                return sub;
                            }

                        },

                        {
                            mongoose: mongoose,
                            schema_def: terrain_types_schema
                        },

                        apiary.dataspace,

                        function (err, places_model) {
                            model = places_model;

                            model.count(function (err, records) {
                                if (records < 1) {
                                    model.add(require('./schema/default_terrain.json'), function () {
                                        deferred.resolve(model);
                                    }); // dont care about callback -- prob not time sensitve.
                                } else {
                                    deferred.resolve(model);
                                }
                            });

                        });
                }
            }

            apiary.on('mixin', listen_for_nerds_mongoose);
        }
    }

    checkForNerdsMongoose();
    return cb(null, deferred);

}; // end export function