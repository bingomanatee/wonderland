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

var things_schema = require(path.resolve(__dirname, 'schema/things_schema.json'));

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
                            name: 'nerds_things'
                        },

                        {
                            mongoose: mongoose,
                            schema_def: things_schema
                        },

                        apiary.dataspace,

                        function (err, things_model) {
                            model = things_model;
                            deferred.resolve(model);
                        });
                }
            }

            apiary.on('mixin', listen_for_nerds_mongoose);
        }
    }

    checkForNerdsMongoose();
    return cb(null, deferred);

}; // end export function