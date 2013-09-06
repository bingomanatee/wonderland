var _ = require('underscore');
var events = require('events');
var util = require('util');
var fs = require('fs');
var path = require('path');
var _DEBUG = false;

var _id = 0;
function Component(extend, config, cb) {
	this.extend(extend);
	this.component_id = ++_id;
	var self = this;
	this.config(config, function (err, config) {
		if (cb) {
			if (_DEBUG) {
				console.log('returning component %s', util.inspect(config));
			}
			cb(err, self)
		} else {
			if (_DEBUG) {
				console.log('component created without callback')
			}
		}
	});
};

util.inherits(Component, events.EventEmitter);

_.extend(Component.prototype, {

	extend: require('./extend'),

	_params: require('./params'),

	init: require('./init'),

	TYPE: 'HIVE_COMPONENT',

	// ****************** CONFIGURE *******************

	config: require('./config'),

	get_config: function (key, def) {
		if (!this.has_config(key)){
			return def;
		}
		return this.config().get(key);
	},

	set_config: function (key, value) {
		return this.config().set(key, value);
	},

	has_config: function(key){
		return this.config().has(key)
	}

})

module.exports = Component