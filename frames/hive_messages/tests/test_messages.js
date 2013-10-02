var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var mvc = require('hive-mvc');
var mongoose = require('mongoose');

var _DEBUG = false;

/* *********************** TEST SCAFFOLDING ********************* */

/* ************************* TESTS ****************************** */

var apiary = mvc.Apiary({}, path.resolve(__dirname, '../../'));

apiary.set_config('frame_filter', ['hive_messages']);

apiary.init(function () {
	apiary.Resource.list.find({TYPE: 'view_helper', name: 'message_view_helper'}).one(
		function (err, view_helper) {

			if (true) {
				tap.test('test messages', function (t) {

					var action_stub = apiary.Action({}, {});
					var context = apiary.Context({session: {}, method: 'get'}, {}, action_stub);
					context.add_message('a message', 'info');

					t.deepEqual(context.$session('messages'), [
						{
							"text": "a message",
							"key":  "info"
						}
					], 'messages in storage');

					action_stub.respond(context, function (err, out) {
						var out = context.$out.valueOf();
						view_helper.respond(context, out, function () {

							t.ok(out.helpers.has_messages(), 'helper has messages');
							var messages = out.helpers.messages();
							t.deepEqual(messages, {info: ['a message']}, 'messages are ordered');
							t.ok(!out.helpers.has_messages(), ' helper no longer has messages');
							t.end();
						});
					});
				})
			}
			if (true) {
				tap.test('test renderer', function (t) {

					var action_stub = apiary.Action({}, {});
					var context = apiary.Context({session: {}, method: 'get'}, {}, action_stub);
					context.add_message('a message', 'info');

					t.deepEqual(context.$session('messages'), [
						{
							"text": "a message",
							"key":  "info"
						}
					], 'messages in storage');

					action_stub.respond(context, function (err, out) {
						var out = context.$out.valueOf();
						view_helper.respond(context, out, function () {
							t.ok(out.helpers.has_messages(), 'helper has messages');
							var messages = out.helpers.message_alert();
							console.log('message alert, %s', messages);
							t.deepEqual(messages.replace(/[\s]*\n[\s]*/g, ''), '<div class="info"><button type="button" class="close" data-dismiss="info">&times;</button><ul><li>a message</li></ul></div>', 'message alert');
							t.ok(!out.helpers.has_messages(), ' helper no longer has messages');
							t.end();
						});
					});
				})
			}
		});
}); // end tap.test 1