var hive_loader = require('hive-loader');
var _ = require('underscore');
var util = require('util');
var _DEBUG = false;

var _mixins = {
	name:    'config_handler',
	respond: function (params) {
		if (_DEBUG) console.log('found config path: %s', params.file_path);
		var self = this;
		try {
			var configs = require(params.file_path);
			if (_DEBUG) console.log('layout config: %s', util.inspect(configs));
			self._config.setAll(configs);
			var name;
			if ( name = this.get_config('name')){
				this.name = name;
			}
		} catch(e){
			console.log('error reading config file %s', params.file_path)
		}

	}
};


/**
 *
 * This handler listens for action configurations; it is attached to the layout loader.
 *
 * @param mixins
 * @param config
 * @param cb
 * @return {*}
 */

module.exports = function (mixins, config, cb) {

	return hive_loader.handler(
		[ _mixins, mixins],
		[
			{dir: false, name_filter: /(.*_)?config\.json$/i},
			config
		],
		cb);
}