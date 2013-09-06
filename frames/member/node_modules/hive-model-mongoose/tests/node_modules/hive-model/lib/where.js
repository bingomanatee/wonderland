var _ = require('underscore');

module.exports = function(){
	var query = this.find();
	return query.where.apply(query, _.toArray(arguments));
}