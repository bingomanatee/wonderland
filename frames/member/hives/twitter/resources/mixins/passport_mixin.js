var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var passport_facebook = require('passport-facebook');
var passport = require('passport');
var FacebookStrategy = passport_facebook.Strategy;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */
var FACEBOOK_APP_ID = "--insert-facebook-app-id-here--";
var FACEBOOK_APP_SECRET = "--insert-facebook-app-secret-here--";

/* ********* EXPORTS ******** */

module.exports = function (apiary, callback) {

	callback(null, {
		name:    'facebook_passport',
		respond: function (done) {
			var member_model = apiary.model('member');

			FACEBOOK_APP_ID = apiary.get_config('facebook_app_id');
			FACEBOOK_APP_SECRET = apiary.get_config('facebook_app_secret');
			if (_DEBUG) console.log('FB ID: %s/ FB S: %s', FACEBOOK_APP_ID, FACEBOOK_APP_SECRET);

			passport.use(new FacebookStrategy({
					clientID:     FACEBOOK_APP_ID,
					clientSecret: FACEBOOK_APP_SECRET,
					callbackURL:  apiary.get_config('domain_url') + "/sign_in/facebook/accept"
				},
				function (accessToken, refreshToken, profile, done2) {
					console.log('profile: %s', util.inspect(profile));

					profile.provider = 'facebook';

					member_model.add_from_oauth(profile, function(err, member){
						console.log('member for profile %s: %s', util.inspect(profile), util.inspect(member));
						done2(null, member);
					})

				}
			));

			done();
		}
	})

}; // end export function