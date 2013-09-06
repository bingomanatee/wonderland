var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

/* ************************************
 * This model holds a registry of path/alias data records
 * of the form
 * {
 *      name: string,
 *      pattern: /regex/
 * }
 * It is a persistent model - established on launch.
 *
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {

	var model = apiary.Model({
		name: 'js_path_alias',
		match: function(url){
			return _.find(this.all().records(), function(item){
				return item.pattern.test(url);
			})
		},
		_pk:  'name'
	});

	function get_aliases(item){
		var aliases = item.get_config('js_aliases');
		_.each(aliases, function(item){
				model.put(item);
		})
	}

	apiary.on_action(get_aliases);
	apiary.on_frame(get_aliases);
	apiary.on_hive(get_aliases);

	cb(null, model);

}; // end export function