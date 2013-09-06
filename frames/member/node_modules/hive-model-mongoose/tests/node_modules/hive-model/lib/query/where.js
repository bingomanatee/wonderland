var _ = require('underscore');
var filter_data = require('./../filter_data');
var kov = require('./key_op_value');

module.exports = function () {
	var args = _.toArray(arguments);

	if (args.length > 1 && _.isFunction(_.last(args))) {
		var callback = args.pop();
	}

	switch (args.length) {
		case 3:
			// value, operator, comparator
			kov.apply(this, args);
			break;

		case 2:
			// value, equals
			args.splice(1, 0, '=');
			kov.apply(this, args);
			break;

		case 1:
			// object/function ... hopefully?
			this.data = filter_data(this.data, args[0])
			break;

		default:
			throw new Error('bad length of query args: ' + args.length)
	}

	return this.callback(callback);
}