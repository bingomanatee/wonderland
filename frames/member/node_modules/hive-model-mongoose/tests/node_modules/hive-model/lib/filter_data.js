var _ = require('underscore');
var _DEBUG = false;
var util = require('util');

module.exports = function (data, query, callback) {
	if (_.isFunction(query)){
		var filtered_data = _.filter(data, query);
	} else if (_.isObject(query)){
		var filtered_data = _.filter(data, function (item) {
			var match = true;
			_.each(query, function (value, key) {
				if (match && (!(item[key] == value))) {
					if (_DEBUG) console.log('field %s of %s is not %s; returning false', key, util.inspect(item), value)
					match = false;
				}
			})
			return match;
		})
	}

	if (callback) {
		callback(null, filtered_data);
	}
	if (_DEBUG) console.log('filtered data: %s', util.inspect(filtered_data));
	return filtered_data;
}