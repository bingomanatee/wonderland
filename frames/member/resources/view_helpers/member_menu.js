var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var moment = require('moment');
var ejs = require('ejs');
var hm = require('hive-menu');

/* ************************************
 * attemptig to convert member menu from self contained widget to hive-menu client
 * @TODO: finish
 * ************************************ */

/* ******* CLOSURE ********* */


/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {

	fs.readFile(path.resolve(__dirname, 'sidebar_template.html'), 'utf8', function (err, txt) {

		var helper = {

			name: 'members_menu',

			test: function (ctx, output) {
				return false;
				return output.helpers && output.helpers.sidebar_menu_data;
			},

			weight: 50,

			respond: function (ctx, output, done) {
				if (!output.helpers) {
					output.helpers = {};
				}

				var member_menu = new hm.Menu({
					name:   'members',
					title:  'Members',
					weight: 1,
					items:  [
					]
				});

				output.helpers.sidebar_menu_data.items.push(member_menu);

				done();
			}
		};

		cb(null, helper);

	})

};