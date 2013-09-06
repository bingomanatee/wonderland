var _ = require('underscore');
var Component = require("hive-component");
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

/** ********************
 *
 * a collection of models, stored as configurations.
 * Dataspaces exist to ensure the uniqueness of model names within an Apiary.
 * While this is essential for the models that make up the inner workins in Apiary,
 * you are free to use other dataspaces for APPLICATION models that depend on multiple repos.
 *
 * Dataspaces register the apiary in the '$$apiary' cofiguration, but there is not (currently)
 * any dependency on the value/existenc of this property.
 *
 * @return Component
 */

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

var _mixins = {

		add: function (model) {
			this.set_config(model.name, model);
		}

	};

/* ********* EXPORTS ******** */

module.exports = function (apiary) {
	return Component(_mixins, {TYPE: 'dataspace', $$apiary: apiary});
}; // end export function