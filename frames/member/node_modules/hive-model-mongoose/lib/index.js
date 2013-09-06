var _ = require('underscore');
var util = require('util');
var _DEBUG = false;
var Component = require('hive-component');

/**
 * Mongoose Model is, for the most part, a wrapper for the mongoose schema.
 * There are a few reasons for its existence:
 *
 * 1) its generally considered good practice to have a layer between
 *    your custom model class and the retrieval class
 *
 * 2) I wanted a more REST-ish API for models, one that while it allows for
 *    mongoosey options, also allows for a more streamlined use of traditional
 *    rest methods a la MyModel.get(3, function(err, my_model)).
 *
 * That being said, the MongooseModel returns Mongoose Documents, not instances
 * of itself or any other custom record by default.
 */

/*
 function MongooseModel(model, config, mongoose) {
 if (!mongoose) {
 throw new Error('Mongoose model must now have an injected mongoose resource.')
 }

 //@TODO: sanitize configuration to protect critical methods.

 if (config) {
 _.extend(this, config);
 }

 _parse_model(model, mongoose, this);

 this.add = _.bind(_add, this);
 this.revise = _.bind(_revise, this);
 this.delete = _.bind(_delete, this);
 this.archive = _.bind(_archive, this);
 _put_mixin(this, mongoose);

 // note: active is bound to the schema.statics inside _parse_model

 var self = this;
 this.active = function (callback) {
 return self.model.active(callback);
 }

 }

 MongooseModel.prototype = {

 force_oid: true,

 get: function (id, fields, options, callback) {
 return this.model.findById(id, fields, options, callback);
 },

 /* REVISE presumes a PARTIAL set of field data. *

 revise: _revise,

 post: function (doc, options, callback) {
 this.put(doc, options, callback);
 },

 all: function (callback, max, skip) {
 try {
 var all = this.model.find({}).sort('_id');

 if (max || skip) {
 all.slice(skip, max);
 }
 if (callback) {
 all.exec(callback);
 } else {
 return all;
 }
 } catch (err) {
 callback(err);
 }
 },

 find: function (crit, field, options, callback) {
 return this.model.find(crit, field, options, callback);
 },

 find_one: function (crit, field, options, callback) {
 return this.model.findOne(crit, field, options, callback);
 },

 model: null,

 /**
 * direct passthrough to mogngoose
 * @conditions: (optional) - a query to qualify count
 * @callback: function
 * @return {Object}
 *
 count: function (conditions, callback) {
 var a = arguments;
 var args = [].slice.call(a, 0);
 return this.model.count.apply(this.model, args);
 },

 validation_errors: function (err) {
 var req_re = /Validator "required" failed for path .*

 function _filter_error(error) {
 if (req_re.test(error)) {
 return 'required';
 }
 return error;
 }

 var list = [];
 for (var field in err.errors) {
 list.push(_filter_error(field + ': ' + err.errors[field].message));
 }
 return list.join(',');
 },

 empty: function (callback) {
 var self = this;
 console.log('dropping %s ...', self.model.name);
 this.model.collection.drop(callback);
 },

 validate: function (values, callback) {
 var m = new this.model(values);
 m.validate(function (err) {
 callback(err, m);
 });
 }
 }
 */
var _mixins = {

	revise:  require('./revise'),
	add:     require('./add'),
	put:     require('./put'),
	delete:  require('./delete'),
	archive: require('./archive'),

	force_oid: true,

	get: function (id, fields, options, callback) {
		return this.model.findById(id, fields, options, callback);
	},

	post: function (doc, options, callback) {
		this.put(doc, options, callback);
	},

	all: function (callback, max, skip) {
		try {
			var all = this.model.find({}).sort('_id');

			if (max || skip) {
				all.slice(skip, max);
			}
			if (callback) {
				all.exec(callback);
			} else {
				return all;
			}
		} catch (err) {
			callback(err);
		}
	},

	find: function (crit, field, options, callback) {
		return this.model.find(crit, field, options, callback);
	},

	find_one: function (crit, field, options, callback) {
		return this.model.findOne(crit, field, options, callback);
	},

	active : function (callback) {
		return this.model.active(callback);
	},

	/**
	 * direct passthrough to mogngoose
	 * @conditions: (optional) - a query to qualify count
	 * @callback: function
	 * @return {Object}
	 */
	count: function (conditions, callback) {
		var a = arguments;
		var args = [].slice.call(a, 0);
		return this.model.count.apply(this.model, args);
	},

	validation_errors: function (err) {
		var req_re = /Validator "required" failed for path .*/;

		function _filter_error(error) {
			if (req_re.test(error)) {
				return 'required';
			}
			return error;
		}

		var list = [];
		for (var field in err.errors) {
			list.push(_filter_error(field + ': ' + err.errors[field].message));
		}
		return list.join(',');
	},

	empty: function (callback) {
		var self = this;
		console.log('dropping %s ...', self.model.name);
		this.model.collection.drop(callback);
	},

	validate: function (values, callback) {
		var m = new this.model(values);
		m.validate(function (err) {
			callback(err, m);
		});
	},

	_to_doc: require('./to_doc')
};


var Mongoose_Model = function (mixins, config, dataspace, callback) {

	function _enlist(cb){
		dataspace.add(this);
		cb();
	}

	var _config = {
		init_tasks: [require('./init_model'), _enlist]
	};

	var model = Component([mixins, _mixins], [config, _config]);

	if (!model.has_config('mongoose')) {
		throw new Error('mongoose instance must be passed into config');
	}
	model.init(callback || _.identity);
	return model;
};

Mongoose_Model.factory = function (dataspace) {
	return function (mixins, config, callback) {
		Mongoose_Model(mixins, config, dataspace, callback);
	}
};

module.exports = Mongoose_Model;