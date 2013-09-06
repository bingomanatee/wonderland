var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var async = require('async');

/* ************************************
 * take a list of files in the registry pattern
 * and emit them in order.
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (registry, atomic_cb) {

	var export_files = [];
	var action_count = 0;

	var atomic_items = _.reduce(registry, function (ai, reg) {
		var handler = [function (callback) {

			export_files.push(reg);
			++action_count;
			callback();
		}];

		ai[reg.file_id] = reg.reqs.concat(handler);
		return ai;
	}, {});

	var last = _.pluck(registry, 'file_id');
	last.push(function () {
		atomic_cb(export_files);
	});

	atomic_items._export = last;

	async.auto(atomic_items);
} // end exports