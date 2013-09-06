/**
 * ensures Document state of doc.
 * @param doc mongoose.Document | Object
 * @param mongoose
 * @return mongoose.Document
 */

module.exports = function (doc) {
	var mongoose = this.get_config('mongoose');

    if (doc instanceof mongoose.Document) {
        return doc;
    } else {
        return new this.model(doc);
    }

};