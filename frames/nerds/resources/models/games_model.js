var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var Mongoose_Model = require('hive-model-mongoose');
var Q = require('q');

/* ************************************
 *
 * ************************************ */

/* ******* CLOSURE ********* */

var game_schema = require(path.resolve(__dirname, 'schema/games_schema.json'));

var deferred = Q.defer();

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
                            name: 'nerds_games'
                        },

                        {
                            mongoose: mongoose,
                            schema_def: game_schema
                        },

                        apiary.dataspace,

                        function (err, game_model) {
                            model = game_model;
                            deferred.resolve(model);
                        });
                }
            }

            apiary.on('mixin', listen_for_nerds_mongoose);
        }
    }

    var model;

    checkForNerdsMongoose();
    return cb(null, deferred);

}; // end export function