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

var skills_schema = require(path.resolve(__dirname, 'schema/skills_schema.json'));

var deferred = Q.defer();
var model;

function load_skills(){
    model.all().count(function(err, count){
       console.log('skills: %s', count);
        if (count < 1){
            var cats;
            csv()
                .from.path(path.resolve(__dirname,'schema/skills.csv'), { delimiter: ',', escape: '"' })
                .on('record', function(row,index){
                    console.log('row %s : %s', index, row.join(';'));
                    if (index == 0) {
                        cats = row;
                        return;
                    }

                    var record = _.object(cats, row);

                    record.school = _.compact([record.school, record.school2, record.school3]);
                    record.aliases = record.name.split('/');
                    record.name = record.aliases[0];
                    record.requires = record.requires ? [record.requires.split('/')[0]] : [];

                    console.log('record: %s', util.inspect(record));

                    model.put(record);

                }).on('close', function(){
                    deferred.resolve(model);
                });
        } else {
            deferred.resolve(model);
        }
    });
}

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
                            name: 'nerds_skills'
                        },

                        {
                            mongoose: mongoose,
                            schema_def: skills_schema
                        },

                        apiary.dataspace,

                        function (err, skills_model) {
                            model = skills_model;

                            load_skills();

                        });
                }
            }

            apiary.on('mixin', listen_for_nerds_mongoose);
        }
    }

    checkForNerdsMongoose();
    return cb(null, deferred);

}; // end export function