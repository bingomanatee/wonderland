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

var _sidebar;

/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {

	fs.readFile(path.resolve(__dirname, 'sidebar_template.html'), 'utf8', function(err, txt){

		_sidebar = ejs.compile(txt);

		var helper = {

			name: 'admin_layout_menu',

			test: function (ctx, output) {

				return output.layout_name == 'admin';
			},

			weight: -50,

			respond: function (ctx, output, done) {
				if (!output.helpers){
					output.helpers = {};
				}

				var site_menu = new hm.Menu({
					name: 'admin',
					title: 'Administration',
					items: [
						{name: 'home', title: 'Home', link: '/', weight: -1000000}
					]
				})

				var menu = new hm.Menu({name: 'sidebar', title: '', items: [
					site_menu
				]});

				output.helpers.sidebar_menu_data = menu;

				output.helpers.sidebar_menu = function(){
					return _sidebar(output.helpers.sidebar_menu_data.toJSON());
				};

				done();
			}
		};

		cb(null, helper);

	})

};