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

	on_process: function (context, done) {
		passport.authenticate('facebook',
			{ failureRedirect: '/' },
			function (err, member) {
				console.log('have AUTHENTICATED, %s, %s', err, util.inspect(member));
				context.$session_set('member', member[0]);
				context.$go('/', done);
			})(context.$req, context.$res, done);
	}

} // end action