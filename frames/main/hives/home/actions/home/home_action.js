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

	on_validate: function (context, done) {
		done();
	},

	on_input: function (context, done) {
		done();
	},

	on_process: function (context, done) {
		done();
	},
	
	on_output: function(context, done){
		done();
	}

} // end action