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

module.exports = function (apiary, cb) {


		var helper = {
			name: 'add_fb_auth',

			test: function (ctx, output) {
				return true;
			},

			weight: 100,

			respond: function (ctx, output, done) {
				var menu = output.helpers.member.menu;
				menu.add_auth('facebook', 'Facebook');
				done();
			}
		};

		cb(null, helper);

}// end export function