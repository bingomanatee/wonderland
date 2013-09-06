var Component = require("hive-component");
var _query_mixin = require('./mixins');
var util = require('util');

function Query(model, data, cb) {
	return Component([{model: model, data: data}, _query_mixin], {}, cb);
}

module.exports = Query;