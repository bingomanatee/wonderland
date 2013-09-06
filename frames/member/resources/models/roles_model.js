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

var roles_schema = require(path.resolve(__dirname, 'schema/member_role.json'));

/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {
	var mongoose = apiary.get_config('mongoose');
	var model;
	function role_actions(roles, callback) {
		this.find({_id: {'$in': roles}}, function(err, role_records){
			var out = [];
			if (role_records){
				role_records.forEach(function(record){
					if (record.actions){
						out = out.concat(record.actions);
					}
				})
			}

			callback(null, _.uniq(out));
		})
	}

	function find_or_add_role(role, callback) {
		if (_.isString(role)) {
			role = {_id: role};
		} else if (role.name) {
			role._id = role.name;
		} else if (!role._id) {
			throw new Error('bad role: no _id or name %s', util.inspect(role));
		}
		var self = this;
		this.get(role._id, function (err, foundrole) {
			if (foundrole) {
				if (role.actions) {
					foundrole.actions = role.actions;
					foundrole.markModified('actions');
					foundrole.save(); // note - NOT waiting for response.
				}
				callback(null, foundrole);
			} else {
				self.put(role, callback);
			}
		})
	}

	Mongoose_Model(
		{
			name:             'member_role',
			find_or_add_role: find_or_add_role,
			role_actions:     role_actions
		}
		, {
			mongoose:   mongoose,
			schema_def: roles_schema
		},
		apiary.dataspace,
		function (err, role_model) {
			model = role_model;
			cb(null, model);
		});

}; // end export function