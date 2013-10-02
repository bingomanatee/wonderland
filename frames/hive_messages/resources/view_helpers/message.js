var _ = require('underscore');
var util = require('util');
var path = require('path');
var _DEBUG = false;
var fs = require('fs');

var alert_template;

module.exports = function (apiary, callback) {
	fs.readFile(path.resolve(__dirname, 'templates/message_alert.html'), 'utf8', function (err, template) {
		alert_template = _.template(template);

		var _helper = {
			weight:  100,
			name: 'message_view_helper',
			respond: function (ctx, output, cb) {
				if (!output.helpers) {
					output.helpers = {};
				}

				output.helpers.messages = function (key) {
					var messages = ctx.$session('messages') || [];
			//		console.log('messages ... ', util.inspect(messages));
					var out;

					if (key) {
						function test(m) {
							return m.key == key;
						}

						out = _.filter(messages, test);
						ctx.$session_set('messages', _.reject(messages, test));

					} else {
						out = messages;
						ctx.$session_clear('messages');
					}

					out = _.groupBy(out, 'key');
					_.each(out, function(items, key){
						out[key] = _.pluck(items, 'text');
					})

					return out;
				};

				output.helpers.has_messages = function () {
					return ctx.$session('messages') && (ctx.$session('messages').length);
				};

				output.helpers.message_alert = function () {
					if (!output.helpers.has_messages()) {
						return '<!-- no messages -->';
					}

					var data = output.helpers.messages();
					console.log('message data: %s', util.inspect(data));

					return  alert_template({keys: data, _: _});
				};

				cb();
			}
		};

		callback(null, _helper);
	})
};
