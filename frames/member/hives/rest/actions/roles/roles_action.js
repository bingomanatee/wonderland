var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = {

	/* *********** GET ********** */

	on_get_validate: function (context, callback) {
		callback();
	},

	on_get_input: function (context, callback) {
		var model = this.model('member_role');
		model.all(function(err, roles){
			if (err){
				callback(err);
			} else {
				context.$send(_.map(roles, function(role){
					return role.toJSON();
				}), callback);
			}
		})
	}

}; // end action