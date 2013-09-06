var Component = require('./lib/Component');

module.exports = function (mixins, config, cb) {
	return new Component(mixins, config, cb)
};

module.exports.Component = Component;