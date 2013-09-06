module.exports = function (mongoose_model) {
	return    {
		active: function (callback) {
			var q = {'$nor': [
				{deleted: true}
			]};
			return callback ? mongoose_model.find(q).exec(callback) : mongoose_model.find(q);
		},

		active_count: function (callback) {
			var q = {'$nor': [
				{deleted: true}
			]};
			return callback ? mongoose_model.find(q).count(callback) : mongoose_model.find(q).count();
		},

		inactive: function (callback) {
			return callback ? mongoose_model.find('deleted', true).exec(callback) : mongoose_model.find('deleted', true)
		}
	};
};