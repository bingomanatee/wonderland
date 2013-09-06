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

var actions_schema = require(path.resolve(__dirname, 'schema/member_action.json'));

/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {
	var mongoose = apiary.get_config('mongoose');
	var model;

	Mongoose_Model(
		{
			name:               'member_action',
			find_or_add_action: function (action, callback) {
				if (_.isString(action)) {
					action = {_id: action};
				}
				var self = this;
				this.get(action._id, function (err, foundAction) {
					if (foundAction) {
						callback(null, foundAction);
					} else {
						self.put(action, callback);
					}
				})
			}
		},

		{
			mongoose:   mongoose,
			schema_def: actions_schema
		},

		apiary.dataspace,

		function (err, action_model) {
			model = action_model;
			cb(null, model);
		});

}; // end export function