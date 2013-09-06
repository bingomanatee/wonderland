var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var events = require('events');

/* ************************************
 * This is a generic list of resources.
 * Unlike the other memory-persistent models in an apiary,
 * this is a short term collection of data
 * that only lives as long as a request.
 * ************************************ */

/* ******* CLOSURE ********* */

function Resource_Model_Base() {
	this.items = [];
}


util.inherits(Resource_Model_Base, events.EventEmitter);

_.extend(Resource_Model_Base.prototype,{
		add: function (data) {
			data = _.clone(data);
			var old_data = this.find(data);
			if (old_data) {
				this.merge(data, old_data);
			}
			this.items.push(data);
			if (_DEBUG)	console.log('adding item %s', util.inspect(data));
			this.emit('add', data);
			return data;
		},

		/**
		 * note - override with a more context-relevant property merge
		 *
		 * @param new_data {object}
		 * @param old_data {object}
		 */
		merge: function(new_data, old_data){
			_.defaults(new_data, old_data);
		},

		/**
		 * note - override with a more context-relevant query system
		 * @param query
		 * @returns {array}
		 */
		find: function (query) {
			throw new Error('must override find')
		},

		add_items: function (list) {
			var out = [];

			if (!_.isArray(list)) {
				throw new Error('bad input for base ' + util.inspect(list));
			}

			list.forEach(function (item) {
				out.push(this.add(item));
			}, this);

			return out;
		}
	})
/* ********* EXPORTS ******** */

module.exports = Resource_Model_Base;