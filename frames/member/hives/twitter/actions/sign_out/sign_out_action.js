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

	on_process: function (context, callback) {
		context.$session_clear('member');
		context.$req.logOut();

		context.$go('/', callback);
	}

} // end action