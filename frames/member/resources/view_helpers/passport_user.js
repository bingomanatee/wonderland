var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

Member_Menu = function (ctx) {
	this.context = ctx;
	this.auths = [];
};

Member_Menu.prototype = {

	add_auth: function (type, label) {

		var member = this.context.$session('member');

		var oap = null;
		if (member){
		//	console.log('searching %s for %s',  util.inspect(member.valueOf()), type);
			for (var i = 0; i < member.oauthProfiles.length; ++ i){
				if (member.oauthProfiles[i].provider == type){
					oap =  member.oauthProfiles[i];
				}
			}
		//	console.log('.......... oap for %s: %s', type, util.inspect(oap));
		} else {
		//	console.log('.......... no member for %s in session', type);
			member = false;
		}

		this.auths.push({type: type, label: label, member: oap});
	},

	util: util,

	render: function () {
		return menu_template(this);
	}

}

var menu_template;

/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {

	fs.readFile(path.resolve(__dirname, 'templates/menu.html'), 'utf8', function (err, txt) {
		menu_template = _.template(txt);

		var helper = {
			name: 'passport_user',

			test: function (ctx, output) {
				return true;
			},

			weight: -100,

			respond: function (ctx, output, done) {

				if (!output.helpers) output.helpers = {};
				if (!output.helpers.member) output.helpers.member = {};
				if (!output.helpers.member.auths) output.helpers.member.auths = {};

				console.log('adding member menu');
				output.helpers.member.menu = new Member_Menu(ctx);

				done();
			}
		};

		cb(null, helper);
	});

}// end export function