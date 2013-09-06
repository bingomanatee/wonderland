var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

function _new_target(atom) {
	return {target: atom.target, files: [atom.file]};
}
/* ********* EXPORTS ******** */

module.exports = function (atomized) {

	return _.reduce(atomized, function (atomized, atom) {
		if (!atomized.length) {
			atomized.push(_new_target(atom));
		} else {
			var last = _.last(atomized);
			if (last.target && last.target == atom.target){
				last.files.push(atom.file);
			} else {
				atomized.push(_new_target(atom));
			}
		}
		return atomized;
	}, []);

}; // end exports