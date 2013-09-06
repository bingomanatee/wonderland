var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');

module.exports = function () {
	var self = this;
	var args = _.toArray(arguments);
	var callback = args.pop();

	if (args.length) {
		var dump_path = args[0];
	} else {
		var dump_path = this.get_config('dump_path');
	}

	if (!dump_path) return callback(new Error('no dump_path to dump ' + this.name));

	dump_path = this._fix_dump_path(dump_path);

	fs.exists(path.dirname(dump_path), function (exists) {
		if (exists) {

			//@TODO: mode - write individual files
			try {
				var data = JSON.stringify({data: self.data, written: new Date().toString()}, true, 4);
				fs.writeFile(dump_path, data, 'utf8', callback);
			} catch (e) {
				callback(e);
			}
		} else {
			callback(new Error('cannot find path ' + dump_path))
		}
	})

}