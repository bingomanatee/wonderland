var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var _DEBUG = false;

function _slice() {

	var callback;
	var args = _.toArray(arguments);
	if (_.isFunction(_.last(args))) {
		callback = args.pop();
	}

	var start = args[0] || 0;
	var length = args[1] || this.data.length;

	if (this.data.slice == _slice) {
		if (_DEBUG) console.log('data: %s', util.inspect(this.data));
		throw new Error('data == query recursion');
	}

	this.data = this.data.slice(start, length);
	return this.callback(callback);
}

module.exports = {

	TYPE:  'model_query', count: function (cb) {
		if (cb) {
			return cb(null, this.data.length);
		} else {
			return this.data.length;
		}
	},
	where: require('./where'),

	records: function (cb) {
		if (cb) {
			cb(null, this.data.slice(0));
			return this;
		}
		return this.data.slice(0);
	},
	sort:    require('./sort'),

	one: function (cb) {
		if (cb) {
			cb(null, this.data[0]);
		} else {
			return this.data[0];
		}
	},

	first: function (cb) {
		if (cb) {
			cb(null, this.data[0]);
		} else {
			return this.data[0];
		}
	},

	last: function (cb) {
		if (cb) {
			cb(null, _.last(this.data));
		} else {
			return _.last(this.data);
		}
	},

	slice: _slice,

	callback: function (callback) {
		if (callback) {
			callback(null, this.data.slice(0));
		}
		return this;
	}

}