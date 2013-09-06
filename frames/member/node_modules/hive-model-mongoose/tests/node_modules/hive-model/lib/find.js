var Query = require('./query');
var filter_data = require('./filter_data');
var util = require('util');

module.exports = function (query, callback) {
	if (query) {
		var data = filter_data(this.data, query, callback);
		if (!callback) {
			return Query(this, data);
		}
	} else {
		var data = this.data.slice(0);
		return Query(this, data);
	}
}