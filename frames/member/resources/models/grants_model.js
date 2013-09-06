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

var grants_schema = require(path.resolve(__dirname, 'schema/member_grant.json'));

/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {
	var mongoose = apiary.get_config('mongoose');
	var model;

	Mongoose_Model(
		{
			name: 'member_grant'
		},

		{
			mongoose:   mongoose,
			schema_def: grants_schema
		},

		apiary.dataspace,

		function (err, grant_model) {
			model = grant_model;
			cb(null, model);
		});

}; // end export function