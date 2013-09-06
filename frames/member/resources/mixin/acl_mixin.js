var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = true;
var passport_facebook = require('passport-facebook');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var Gate = require('gate');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */
var FACEBOOK_APP_ID = "--insert-facebook-app-id-here--";
var FACEBOOK_APP_SECRET = "--insert-facebook-app-secret-here--";

/* ********* EXPORTS ******** */

module.exports = function (apiary, callback) {

	callback(null, {
		name:    'update_member_actions',
		respond: function (done) {

			var role_model = apiary.model('member_role');
			var member_model = apiary.model('member_action');

			apiary.Frame.list.all().records(function(err, frames){

				var gate = Gate.create();

				frames.forEach(function(frame){
				//	console.log('frame: %s', util.inspect(frame, false, 0));
					if (frame.has_config('member_actions')){
						frame.get_config('member_actions').forEach(function(action){
							member_model.find_or_add_action(action, gate.latch());
						})
					}

					if (frame.has_config('member_roles')){
						frame.get_config('member_roles').forEach(function(role){
						//  	console.log('adding role %s', util.inspect(role));
							role_model.find_or_add_role(role, gate.latch());
						});
					}

				});

				gate.await(done);
			});

		}
	})

}; // end export function