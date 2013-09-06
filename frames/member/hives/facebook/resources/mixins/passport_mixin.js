var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var passport_facebook = require('passport-facebook');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

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

			TWITTER_CONSUMER_KEY = apiary.get_config('twitter_consumer_key');
			TWITTER_CONSUMER_SECRET = apiary.get_config('twitter_consumer_secret');
			var domain_url = apiary.get_config('domain_url');

			if (_DEBUG) console.log('T ID: %s/ T S: %s', TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET);

			passport.use(new TwitterStrategy({
					consumerKey: TWITTER_CONSUMER_KEY,
					consumerSecret: TWITTER_CONSUMER_SECRET,
					callbackURL: domain_url + "/sign_in/twitter/callback"
				},
				function(token, tokenSecret, profile, done2) {
					//console.log('profile: %s', util.inspect(profile));
					profile.provider = 'twitter';

					member_model.add_from_oauth(profile, function(err, member){
					//	console.log('member for profile %s: %s', util.inspect(profile), util.inspect(member));
						done2(null, member);
					})
				}
			));

			done();
		}
	})

}; // end export function