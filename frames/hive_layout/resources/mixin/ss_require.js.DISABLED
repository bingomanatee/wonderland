var Gate = require('gate');
var _ = require('underscore')
var _DEBUG = false;
var util = require('util');
var path = require('path');

module.exports = function (cb) {
	cb(null, {
		respond: function (callback) {

			var mp = path.resolve(__dirname, '../../../../../../index');
			var mvc = require(mp);

			mvc.Model({name: '$ss_require'});

			callback();
		}
	});
}