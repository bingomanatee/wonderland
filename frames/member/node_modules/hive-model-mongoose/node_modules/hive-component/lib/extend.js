var _ = require('underscore');
var _DEBUG = true;

module.exports = function (ob, supplement) {
	var self = this;

	_.each(this._params(ob), function(value, key){
		if (supplement && this.hasOwnProperty(key)){
			return;
		}
		if (_.isArray(value)){
			self[key] = value.slice(0);
		} else if (_.isFunction(value)){
			self[key] = value;
		} else if (_.isObject(value)){
			self[key] = _.clone(value);
		} else {
			self[key] = value;
		}
	})
}