var _DEBUG = false;
var util = require('util');

module.exports = function(item){
	var id = item[this._pk];
	if (_DEBUG) console.log('indexing record with id of %s into model %s with pk of %s', id, this.name, this._pk);
	if (!id) {
		id = this._make_pk(item);
		if (_DEBUG) console.log('making key (pk = ) for %s: %s in %s', this._pk, util.inspect(item), id, this.name);
		item[this._pk] = id;
	}
	this._index[id] = item;
}