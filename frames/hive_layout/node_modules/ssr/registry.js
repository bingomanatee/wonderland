var _ = require('underscore');

function _ensure_sri_regex(sri) {
	if (!sri.$regex) {
		if (sri.pattern) {
			sri.$regex = new RegExp(sri.pattern, sri.pattern_config);
		}
	}
}

function File_Identity(file, file_id, pattern, reqs, target) {
	this.file = file;
	this.target = target || '',
	this.file_id = file_id;
	this.pattern =_.isString(pattern) ? new RegExp(pattern): (pattern instanceof RegExp) ? pattern : _.isArray(pattern) ? new RegExp(pattern[0], pattern[1]) : (function(){
		throw new Error('cannot decode regex ' + util.inspect(pattern))
	}());
	this.reqs = reqs || [];
}

module.exports = function (ssr_req, files) {
	return _.reduce(files,
		function (registry, file) {

			// see if an existing registry entry covers the file

			if (_.any(registry, function (reg) {
				return reg.pattern.test(file);
			})) {
				return registry;
			}

			// if not, see if there is a registered pattern of requirements

			var new_sri = _.find(ssr_req, function (sri) {
				_ensure_sri_regex(sri);
				return (sri.$regex) ? sri.$regex.test(file) : false;
			});

			if (new_sri) {
				registry.push(
					new File_Identity(
						file,
						new_sri.file_id,
						[new_sri.pattern, new_sri.pattern_spec],
						new_sri.reqs,
						new_sri.target)
				);
			} else {
				// there is no requirements for this file - add the file as a new registration;
				registry.push(new File_Identity(file, file, file));
			}

			return registry;

		}, []);
};