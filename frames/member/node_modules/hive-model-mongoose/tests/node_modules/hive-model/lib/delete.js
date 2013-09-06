var _ = require('underscore');
var _DEBUG = false;
var util = require('util');

module.exports = function (i, cb) {
	var self = this;
	i = this.as_id(i);
	if (_DEBUG) console.log('deleted %s', i);
	this.get(i, function (err, record) {
			if (record){
				if (_DEBUG) console.log('deleting %s', util.inspect(record));
				delete(self._index[i]);
				self.data = _.reject(self.data, function (item) {
					return item[self._pk] == i;
				});
				if (cb) cb(null, record);
			} else {
				if (cb) cb(null, null);
			}
		}
	)
}