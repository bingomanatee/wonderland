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

			name: 'member_admin_menu',

			test: function (ctx, output) {
				return (output.layout_name == 'admin') &&  output.helpers && output.helpers.sidebar_menu_data;
			},

			weight: 0,

			respond: function (ctx, output, done) {
				if (!output.helpers){
					output.helpers = {};
				}

				var member_model = apiary.model('member');

				member_model.ican(ctx, ['edit member'], function(){
					var member_menu = new hm.Menu({
						name: 'members',
						title: 'Members',
						weight: 100,
						items: [
						]
					});

					output.helpers.sidebar_menu_data.add(member_menu);
					member_menu.add({
						title: 'Members',
						link: '/admin/members/list'
					});

					member_menu.add({
						title:'Member Actions',
						link: '/admin/members/actions'
					});
					done();
				}, done);

			}
		};

		cb(null, helper);

};