var _ = require('underscore');

module.exports = {
	data:    [],
	_index:  {},
	indexes: [],

	get: require('./get'),

	_pk: 'id',

	_make_pk: function (item) {
		var max_pk = _.max(_.keys(this._index));
		var id = 1 + max_pk;
		if (item) {
			item[this._pk] = id;
		}
		return id;
	},

	put: require('./put'),

	add: require('./add'),

	as_id: function (i) {
		if (_.isObject(i)) {
			i = i[this._pk];
		}
		return i;
	},

	has_keys: function (keys, cb) {
		if (!_.isArray(keys)) {
			keys = [keys];
		}

		var has_all = true;
		var self = this;
		_.each(keys, function (key) {
			if (!has_all) {
				return;
			}
			if (!self._index[key]) {
				has_all = false;
			}
		})

		if (cb) {
			cb(err, has_all);
		}
		return has_all;
	},

	update_record: require('./update_record'),

	index_record: require('./index_record'),

	delete: require('./delete'),

	find: require('./find'),

	where: require('./where'),

	all: require('./all'),

	dump: require('./dump'),

	load: require('./load'),

	_fix_dump_path: require('./fix_dump_path'),

	count: function (cb) {
		if (cb) {
			cb(null, this.data.length);
		}
		return this.data.length;
	}
}
