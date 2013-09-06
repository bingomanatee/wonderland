var Query = require('./query');

module.exports = function (callback) {
	if (callback) {
		callback(null, this.data.slice(0));
	} else {
		return Query(this, this.data.slice(0));
	}
}