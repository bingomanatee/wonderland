var _ = require('underscore');
var Table = require('cli-table');

/**
 * note: head labels MUST be the same as field keys.
 * @param def {head: [], colWidths: {}}
 */

module.exports = function(def){
	if (!def){
		def = {
			head: [],
			colWidths: []
		}
		_.each(_.keys(this.data[0]), function(key){
			head.push[key];
			colWidths.push[100];
		})

		var table = new Table(def);
		_.each(this.data, function(record){
			var row = [];
			_.each(def.head, function(key){
				if (record.hasOwnProperty(key)){
					row.push(record[key]);
				} else {
					row.push('');
				}
			});

			table.push(row);
		});

		return table.toString();
	}
}