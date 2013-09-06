var _ = require('underscore');
var util = require('util');
var path = require('path');
var _DEBUG = false;

module.exports = function (apiary, cb) {

	var helper = {
		name: 'layout',

		test: function (ctx, output) {
			return output.layout_name;
		},

		weight: 100,

		respond: function (ctx, output, cb) {
			var lm = apiary.model('$layouts');
			lm.get(output.layout_name, function (err, layout) {
				if (layout) {
					output.layout = layout;
				} else {
					console.log('cannot find layout %s', output.layout_name);
				}

				cb(null, ctx, output);
			})
		}
	};

	cb(null, helper);
};