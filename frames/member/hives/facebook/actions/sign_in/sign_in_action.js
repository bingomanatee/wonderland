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
		var self;
		var handler = passport.authenticate('facebook',
			function(req, res){
				self.emit('log', 'debug', 'handler authenticate called');
				done();
			}
		);
		handler(context.$req, context.$res, function(){
			self.emit('log', 'debug', 'handler sign in callback called');
			done();
		})
	}
}; // end action