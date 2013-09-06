var _ = require('underscore');
var events = require('events');
var util = require('util');
var fs = require('fs');
var path = require('path');
var Gate = require('gate');
var async = require('async');
var _DEBUG = false;

module.exports = function ( callback, tasks) {
	var self = this;
	if (!tasks){
		if (!self.config().has('init_tasks')){
			self.set_config('init_tasks', []);
		}
		tasks = self.get_config('init_tasks');
	}
	if (_DEBUG){
		console.log(' ------------------ tasks: %s', util.inspect(tasks));
	}

	var wf = _.map(tasks, function(task){
		return _.bind(task, self)
	});

	async.waterfall(wf, function(){
		if (callback){
			callback(null, self);
		}
	});

}