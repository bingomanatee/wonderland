var _ = require('underscore');
var util = require('util');

function _sort(key, reverse) {

	if (_.isFunction(key)) {
		this.data = _.sortBy(this.data, key);
	} else if (_.isString(key)){
		this.data = _.sortBy(this.data, function (record) {
			return record[key];
		})
	} else {
		throw new Error(util.format('bad argument to query sort: %s', util.inspect(key)));
	}
	if (reverse){
		this.data.reverse()
	}
}

module.exports = function () {
	var callback;
	var args = _.toArray(arguments);
	if (_.isFunction(_.last(args))) {
		callback = args.pop();
	}

	switch (args.length) {
		case 1:
			_sort.apply(this, args);
			break;

		case 2:
			_sort.apply(this, args);
			break;

		default:
			throw new Error('bad length of sort query args: ' + args.length);
	}

	return this.callback(callback);
}