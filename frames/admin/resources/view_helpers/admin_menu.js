var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var moment = require('moment');
var ejs = require('ejs');
var hm = require('hive-menu');

/* ************************************
 *
 * ************************************ */

/* ******* CLOSURE ********* */


/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {

	var helper = {

		name: 'admin_menu',

		test: function (ctx, output) {
			return output.helpers && output.helpers.sidebar_menu_data;
		},

		weight: 100,

		respond: function (ctx, output, done) {
			if (!output.helpers) {
				output.helpers = {};
			}

			var member_model = apiary.model('member');

			if (output.layout_name == 'hiveblog'){
				member_model.ican(ctx, ['administer site'], function () {

					var admin_menu = new hm.Menu({
						name:   'admin',
						title:  'Administer Site',
						weight: 10000
					});
					admin_menu.add({
						title: 'Administer Site',
						link:  '/admin'
					});

					output.helpers.sidebar_menu_data.add(admin_menu);

					done();
				}, done);
			} else {
				done();
			}
		}
	};

	cb(null, helper);

};