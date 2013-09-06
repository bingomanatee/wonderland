var Gate = require('gate');
var _ = require('underscore');
var util = require('util');
var path = require('path');
var layouts_dir_loader = require('loaders/layouts_dir_loader');
var _DEBUG = false;

module.exports = function (apiary, cb) {
	cb(null, {
		name: 'layout_mixin',
		respond: function (callback) {

			function load_layouts(frame, cb) {
				if (_DEBUG) {
					console.log('scanning frame for layouts folder: %s', frame.get_config('root'));
				}
				var ll = layouts_dir_loader(frame.get_config('root'));
				ll.core(apiary);

				ll.load(_.identity);
			}

			apiary.on_frame(load_layouts);
			callback();
		}
	})
};