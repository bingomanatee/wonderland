var _ = require('underscore');
var Gate = require('Gate');

module.exports = function(records, cb){
	if (cb){
		var gate = Gate.create();
	}
	var self = this;
	_.each(records, function(record){
		if (gate){
			self.put(record, gate.latch());
		} else {
			self.put(record);
		}
	})
	if(gate){
		gate.await(cb);
	}
};