var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

/* ************************************
 * Note - both "id" or "data" can be functions: so the api is
 *
 * my_model.
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (id, data, cb) {
	if (arguments.length == 1) {
		data = id;
		id = this.as_id(id);
	}

	function _update(err, records) {
		if (err) {
			if (cb){
				return cb(err);
			} else {
				throw err;
			}
		} else {
			_.each(records, function(record, i){
				if (_.isFunction(data)){
					data(record);
				} else {
					_.extend(record, data);
				}
				self.put(record);
			})
			if (cb){
				cb(null, records);
			} else {
				return records;
			}
		}

	}

	if (_.isFunction(id)) {
		this.where(id, _update);
	} else {
		var record = this.get(id);
		if (record) {
			return _update(null, [record]);
		} else if (cb) {
			cb(new Error('cannot find PK ' + id));
		} else {
			throw new Error('cannot find PK ' + id);
		}
	}

} // end exports