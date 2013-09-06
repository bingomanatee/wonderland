var _ = require('underscore');
var events = require('events');
var util = require('util');
var Configuration = require('hive-configuration');
var fs = require('fs');
var path = require('path');
var _DEBUG = false;

function _init_config(config_obj, self) {
	self._config = new Configuration(self._params(config_obj, 'json'));
}

function _init_config_path(config, cb, self) {

	if (!cb) {
		throw new Error('attempting to load configuration %s without callback', config);
	}

	fs.exists(config, function (config_exists) {
		if (config_exists) {
			fs.readFile(config, 'utf8', function (err, config_data) {
				try {
					var config_obj = JSON.parse(config_data);
				} catch (e) {
					if (cb) {
						return cb(e);
					} else {
						throw e;
					}
				}
				self.config(config_obj, cb);
			});
		} else if (cb) {
			cb(new Error('cannot read ' + config));
		} else {
			throw new Error('cannot read ' + config);
		}
	})
}

function _load_config_with_array(config, self) {

	if (!self._config) {
		_init_config({}, self);
	}

	config.forEach(function (def) {
		self.config().set(def.key, def.value);
	})

}

module.exports = function (config, cb) {
	if (_DEBUG) {
		if (cb) {
			var c = cb;
			cb = function (err, result) {
				console.log('done with configuring component with %s', util.inspect(config));
				if (c) c(err, result);
			}
		}
	}

	if (config) {
		if (_DEBUG) {
			if (config) {
				console.log('configuring compoennt with %s', util.inspect(config));
			}

		}

		var self = this;
		if (_.isString(config)) {
			_init_config_path(config, cb, self);
			return;

		} else if (_.isObject(config)) {
			if (this._config) {
				_.each(config, function (value, key) {
					self.set_config()(key, value);
				})
			} else {
				_init_config(config, this);
			}
		} else if (_.isArray(config)) {
			_load_config_with_array(config, this);
		}
	} else {
		if (!this._config) {
			_init_config({}, this);
		}
	}

	if (cb) {
		if (!this._config) {
			return cb(new Error('managed to get through config with out initialzation!'));
		}
		cb(null, this._config);
	}
	return this._config;
};