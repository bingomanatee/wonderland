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

/* ********* EXPORTS ******** */

module.exports = function (apiary, callback) {

	Mongoose_Model(
		{
			name: 'member_users_facebook'
		}
		, {
			mongoose:   apiary.get_config('mongoose'),
			schema_def: require('./schema/facebook_model.json')
		},
		apiary.dataspace,
		callback);

}; // end export function