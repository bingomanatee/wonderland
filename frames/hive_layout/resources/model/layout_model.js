var _ = require('underscore');
var util = require('util');
var _DEBUG = false;

/* ************************************
 * This model maintains an in-memory collection.
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {

	var model = apiary.Model({
		name: '$layouts',
		_pk:  'name'
	});

	cb(null, model);

}; // end export function