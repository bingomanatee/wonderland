var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var Mongoose_Model = require('hive-model-mongoose');
var Q = require('q');
var csv = require('csv');

/* ************************************
 *
 * ************************************ */

/* ******* CLOSURE ********* */

var things_schema_json = require(path.resolve(__dirname, 'schema/things_schema.json'));
var FIELDS = _.keys(things_schema_json);
FIELDS.push('_id');

var deferred = Q.defer();
var model;

/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {
    var listening = false;

    function _make_model() {
        var mongoose = apiary.get_config('nerds_mongoose');
        var things_schema = mongoose.Schema(things_schema_json);

        Mongoose_Model(
            {
                name: 'nerds_things', pick: function (obj) {
              //  console.log('getting statics from %s with %s', util.inspect(obj), util.inspect(FIELDS));
                var sub = _.pick(obj, FIELDS);
                console.log('sub obj: %s', util.inspect(sub));
                return sub;
            }
            },

            {
                mongoose: mongoose,
                schema_def: things_schema,

            },

            apiary.dataspace,

            function (err, things_model) {
                model = things_model;
                deferred.resolve(model);
            });
    }

    function checkForNerdsMongoose() {
        if (apiary.has_config('nerds_mongoose')) {
            _make_model();
        } else if (!listening) {
            listen = true;
            function listen_for_nerds_mongoose(name, err) {
                if (name == 'nerds_mongoose_connect') {
                    apiary.removeListener('mixin', listen_for_nerds_mongoose);
                    _make_model();
                }
            }

            apiary.on('mixin', listen_for_nerds_mongoose);
        }
    }

    checkForNerdsMongoose();
    return cb(null, deferred);

}; // end export function