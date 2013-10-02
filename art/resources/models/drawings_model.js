var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var Mongoose_Model = require('hive-model-mongoose');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

var actions_schema = require(path.resolve(__dirname, 'schema/drawings.json'));

/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {
    var mongoose = apiary.get_config('mongoose');
    var model;

    Mongoose_Model(
        {
            name: 'drawings',
            can_edit: function (drawing, member) {
                return drawing.creator.toString() == member._id.toString();
            }
        },

        {
            mongoose: mongoose,
            schema_def: actions_schema
        },

        apiary.dataspace,

        function (err, action_model) {
            model = action_model;
            cb(null, model);
        });

}; // end export function