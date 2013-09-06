var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var passport = require('passport');

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = {

    on_input: function(context, done){
        context.$session_set('oauth_token', context.oauth_token);
        context.$session_set('oauth_verifier', context.oauth_verifier);


        var oauth = context.$session('oauth:twitter');
        if (_.isString(oauth)){
            oauth = JSON.parse(oauth);
        }
        oauth.verifier = context.oauth_verifier;
        oauth.token = oauth.oauth_token;
        oauth.token_secret = oauth.oauth_token_secret;

        context.$session_set('oauth_token_twitter', oauth);
        console.log('oauth: %s', util.inspect(oauth));

        //console.log('callback request: %s', util.inspect(context.$session('oauth:twitter'), true, 3));

       // console.log('login accept: %s', util.inspect(context, false, 0));

        done();
    },

    on_process: function (context, done) {
		passport.authenticate('twitter',
			{ failureRedirect: '/' },
			function (err, member) {
				//console.log('have AUTHENTICATED, %s, %s', err, util.inspect(member));
				context.$session_set('member', member[0])
				context.$go('/', done);
			})(context.$req, context.$res, done);
	}

} // end action