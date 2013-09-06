var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var support = require('support');
var path = require('path');
var _DEBUG = false;
module.exports = function () {
	var self = this;
	var args = _.toArray(arguments);
	var callback = args.pop();
	if (args.length) {
		var dump_path = args[0];
	} else {
		var dump_path = this.get_config('dump_path');
	}

	dump_path = this._fix_dump_path(dump_path);

	fs.readFile(dump_path, 'utf8', function (err, data) {
		if (err) {
			if (_DEBUG) console.log('error reading dump path %s: %s', dump_path, err.message);
			return callback(err);
		}
		if (_DEBUG) console.log('reading data %s ...', data.slice(0, 50));

		try {
			self.data = JSON.parse(data).data;
			_.each(self.data, function(record){

				self.index_record(record);
			})
			callback(null, dump_path);
		} catch (e) {
			console.log('parse error: %s', util.inspect(e));
			callback(e);
		}
	})

}