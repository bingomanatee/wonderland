var Gate = require('gate');
var _ = require('underscore');
var util = require('util');
var path = require('path');
var _DEBUG = false;

module.exports = function (apiary, cb) {
	cb(null, {
		name:    'message_context_mixin',
		respond: function (callback) {

			var context = apiary.Context;

			function add_message(text, key) {
				if (!text) return;

				if (!key) key = 'info';
				var message = {
					text: text,
					key:  key
				};

				var messages = this.$session('messages') || [];
				messages.push(message);
				this.$session_set('messages', messages);
			}

			apiary.Context = function (req, res, action) {
				var ctx = context(req, res, action);
				ctx.add_message = add_message;
				return ctx;
			};

			callback();
		}
	})
};