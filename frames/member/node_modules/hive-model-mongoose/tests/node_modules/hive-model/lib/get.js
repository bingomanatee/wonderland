var _ = require('underscore');
var _DEBUG = false;
var util = require('util');

module.exports = function (id, cb) {
	var self = this;
	var item = null;
	if (!id) {
		cb(new Error('no pk passed into model.get'));
	}
	if (_DEBUG) console.log('looking for id %s in _index %s of %s', id, util.inspect(this._index), this.name);
	item = this._index[id];
	if (!item) {
		// do a second pass in case index is bad for some reason
		item = _.find(this._data, function (record) {

			return record[self._pk] == id;
		});
	}

	if (cb) {
		cb(null, item);
	}

	return item;
}