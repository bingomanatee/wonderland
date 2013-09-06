var _ = require('underscore');
var util = require('util');
var path = require('path');
var _DEBUG = false;
var js_model = require('resource_models/javascript');

module.exports = function (apiary, cb) {

	var helper = {
		name: 'client_side_resources',

		test: function (ctx, output) {
			return true;
		},

		weight: 10000,

		respond: function (ctx, output, cb) {
			var action = ctx.$action;
			var hive = action.get_config('hive');
			var layout = output.layout;
			var hive_js = hive.get_config('javascript', []);
			var action_js = action.get_config('javascript', []);
			var layout_js = layout ? layout.get_config('javascript', []) : [];
			var output_js = output.javascript ? output.javascript : [];

if (_DEBUG)			console.log('javascripts: %s', util.inspect(
				hive_js.concat(action_js.concat(layout_js.concat(output_js)))));

			var js_data = js_model(apiary);
			js_data.add_items(hive_js);
			js_data.add_items(action_js);
			js_data.add_items(layout_js);
			js_data.add_items(output_js);
			output.js_model = js_data;
			cb();
		}
	};

	cb(null, helper);
};