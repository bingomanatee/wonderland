var _ = require('underscore');
var fs = require('fs');

function _param_path(o_path) {
	if (fs.existsSync(o_path)) {
		return require(o_path);
	} else {
		console.log('cannot find file %s', o_path);
		throw new Error('prop path not found');
	}
}

module.exports = function (params) {
	if (_.isArray(params)) {
		params = _.compact(params);
		params = _.reduce(params, function (p, o) {
				if (_.isString(o)) {
					o = _param_path(o);
				}
				if (_.isObject(o)) {
					return _.defaults(p, o);
				}
				return p;
			}
		)
	} else if (_.isObject(params)) {
		params = _.clone(params);
	} else if (_.isString(params)) {
		params = _param_path(params, if_string);
	} else {
		params = {};
	}
	return params;
};