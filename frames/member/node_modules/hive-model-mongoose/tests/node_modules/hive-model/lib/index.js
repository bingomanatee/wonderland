var Component = require("hive-component");
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var events = require('events');
var _mixin = require('./mixins');

function _index_records(cb) {
	var self = this;
	var data = this.data;
	//console.log('init tasks for %s', util.inspect(this));
	this.data = [];
	_.each(data, function (record) {
		self.put(record); // adds to index, ensures ID
	});
	cb();
}

/**
 *
 * Models are lists of data a la backbone collections.
 * They can contain any sort of data.
 *
 * Models are stored in dataspaces, which ensure/maintain uniqueness
 * of model name within the dataspace.
 *
 * Models are not designed for any specific backend. They are designed to
 * provide real-time node repositories of records for transient information management.
 *
 * There is no structural requirement for model data or structure, beyond the existence
 * of a unique identifying key identified by the _pk property (that defaults to 'id').
 * Although the default _make_pk assumes integer based IDs, you can easily override this
 * for a different index basis.
 *
 * @param mixin
 * @param config
 * @param cb
 * @return Component(<model>)
 * @constructor
 *
 */

function Model(mixin, config, dataspace, callback) {
	if (!dataspace.type == 'dataspace'){
		throw new Error('bad dataspace passed');
	}

	var model = Component([
		{ TYPE: 'model'},
		mixin,
		_mixin
	], [config, {
		dataspace: dataspace,
		init_tasks: [
			_index_records,
		    function(cb){
			    this.get_config('dataspace').add(this);
			    cb();
		    }
		]
	}]);
	model.init(callback ? callback : _.identity);
	return model;
}

Model.factory = function(dataspace){
	return function(mixin, config, callback){
		return Model(mixin, config, dataspace, callback);
	}
};

module.exports = Model;