var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = {

	on_validate: function (context, callback) {
		var member_model = this.model('member');
		member_model.ican(context, ['administer site'], callback,{
			go: '/',
			message: 'You do not have authorization to administer the site',
			key: 'error'
		});
	},

	on_input: function (context, callback) {
		//console.log('action: %s', util.inspect(this._config, false, 1));
		context.$out.set('routes', _.reduce(this.get_config('apiary').Action.list.all().records(),
			function (out, action) {
				var routes = action.get_config('routes');
				console.log('action: %s', util.inspect(action, false, 0));
				return out.concat(_.reduce(routes, function (out, paths, method) {
					if (!_.isArray(paths)){
						paths = [paths];
					}

					return out.concat(_.map(paths, function(path){
						return {path: path, method: method, action:action.name()}
					}))
				}, []));
			},
			[]
		));
		callback();
	},

	on_process: function (context, callback) {
		context.$send(context.$out.get('routes'), callback);
	}

} // end action