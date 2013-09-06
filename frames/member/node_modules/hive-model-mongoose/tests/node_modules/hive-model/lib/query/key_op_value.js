var _ = require('underscore');


module.exports = function (key, op, value, callback) {
	var _ops = {
		'=': function (record) {
			return record[key] == value;
		},
		'>': function (record) {
			return record[key] > value;
		},
		'<': function (record) {
			return record[key] < value;
		}
	};

	this.data = _.filter(this.data, _ops[op]);

	return this.callback(callback);
}