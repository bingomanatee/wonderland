# Hive-Component

`hive-component` is an npm base class that serves as a factory for the `hive-mvc` and `hive-loader` npm modules.

## Usage

Hive Component is a factory to create custom components based on a `mixin` and `configuration`.
As an example say you want to design a compoennt to add, track and report tags. Tags in this example are lowercased strings,
and you can't have duplicate tags.

A component-using module for tags (`node_modules/tags.js') would be:

```
var hc = require('./../index');
var config = require('hive-configuration');
var _ = require('underscore');
var util = require('util');
var _DEBUG = true;

var _mixins = {
	add_tags: function (tags) {
		_.each(tags, _.bind(function (tag) {
			this.add_tag(tag);
		}, this));
	},

	add_tag: function (tag) {
		if (!tag) {
			throw new Error('trying to add nothing')
		}
		if (!_.isString(tag)) {
			throw new Error('attempt to add non-string tag: %s', util.inspect(tag));
		}
		this._tags.set(tag.toLowerCase(), true);
	},

	tags: function () {
		// @NOTE: not best practice as it depends on internal structure of another module...
		return _.sortBy(_.keys(this._tags.data), _.identity);
	},

	remove_tag: function (tag) {
		if (!tag) {
			throw new Error('trying to remove nothing')
		}
		if (!_.isString(tag)) {
			throw new Error('attempt to add non-string tag: %s', util.inspect(tag));
		}
		this._tags.remove(tag);
	},

	has: function (tag) {
		if (!tag) {
			throw new Error('trying to test nothing')
		}
		if (!_.isString(tag)) {
			throw new Error('attempt to test non-string tag: %s', util.inspect(tag));
		}

		return this._tags.has(tag);
	}
}

module.exports = function (tags, cb) {
	if (!tags) {
		tags = [];
	}

	return hc(_mixins, {
		tags:       new config(),
		init_tasks: [function (cb) {
			console.log('init_tasks')
			this._tags = new config();
			this.add_tags(tags);
			cb();
		}]
	}, cb);
}
```

Using your custom component would look like this: (a `tap` test)

```

tap.test('tags', function (t) {
	Tags(['foo', 'bar'],
		function (err, tags) {
			tags.init(function () {
				t.ok(tags.has('foo'), 'tags has foo');

				t.ok(!tags.has('zoo'), 'tags does not have zoo');
				t.deepEqual(tags.tags(), ['bar', 'foo'], 'manifest of tags 1')
				tags.add_tag('zoo');
				t.ok(tags.has('zoo'), 'tags does not have zoo');

				t.deepEqual(tags.tags(), ['bar', 'foo', 'zoo'], 'manifest of tags 2');

				t.end();
			});
		}) // end test
});


```

the Component() function blends the mixins into a new Component object, and sets the configuration
of the component.

