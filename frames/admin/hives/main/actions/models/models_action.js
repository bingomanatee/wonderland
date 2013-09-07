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
		var ds = this.get_config('apiary').dataspace;
		var models = _.map(_.keys(ds._config.data), function(n){
			return {name: n};
		});
		context.$out = models;
		context.$send(callback);
	}

}; // end action