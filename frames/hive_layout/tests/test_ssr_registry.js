var tap = require('tap');
var ssr_registry = require('ssr/registry');
var ssr_atomize = require('ssr/atomize_reg');
var reduce_atomized = require('ssr/reduce_atomize');
var _ = require('underscore');

tap.test('registry reordering', function (t) {

	var sri_req = [
		{
			file_id: 'jquery',
			pattern: 'jquery(\.min)?\.js$',
			target:  '/vendor.js',
			reqs:    []
		},
		{
			file_id: 'backbone',
			pattern: 'backbone(-min)?\.js$',
			target:  '/vendor.js',
			reqs:    ['underscore']
		},
		{
			file_id: 'underscore',
			pattern: 'underscore(-min)?\.js$',
			target:  '/vendor.js',
			reqs:    []
		},
		{
			file_id: 'my_model',
			pattern: 'my_model\.js$',
			reqs:    ['backbone']
		}

	];

	var files = ['/js/vendor/jquery.js', '/js/jquery.js'];

	var reg = ssr_registry(sri_req, files);
	var oreg = _.sortBy(reg, 'file_id');

	t.deepEqual(oreg, [
		{
			'file':    '/js/vendor/jquery.js',
			'target':  '/vendor.js',
			'file_id': 'jquery',
			'pattern': /jquery(.min)?.js$/,
			'reqs':    []
		}
	], 'compress jquery references');

	files = ['/js/vendor/backbone-min.js', '/underscore.js', '/my_model.js', '/underscore-min.js'];

	reg = ssr_registry(sri_req, files);
	oreg = _.sortBy(reg, 'file_id');

	t.deepEqual(oreg, [
		{
			'file':    '/js/vendor/backbone-min.js',
			'target':  '/vendor.js',
			'file_id': 'backbone',
			'pattern': /backbone(-min)?.js$/,
			'reqs':    [
				'underscore'
			]
		},
		{
			'file':    '/my_model.js',
			'target':  '',
			'file_id': 'my_model',
			'pattern': /my_model.js$/,
			'reqs':    [
				'backbone'
			]
		},
		{
			'file':    '/underscore.js',
			'target':  '/vendor.js',
			'file_id': 'underscore',
			'pattern': /underscore(-min)?.js$/,
			'reqs':    [

			]
		}
	], 'register backbone prereqs');

	ssr_atomize(reg, function (files) {
		t.deepEqual(files, [
			{
				'file':    '/underscore.js',
				'target':  '/vendor.js',
				'file_id': 'underscore',
				'pattern': /underscore(-min)?.js$/,
				'reqs':    []

			},
			{
				'file':    '/js/vendor/backbone-min.js',
				'target':  '/vendor.js',
				'file_id': 'backbone',
				'pattern': /backbone(-min)?.js$/,
				'reqs':    ['underscore']

			},
			{
				'file':    '/my_model.js',
				'target':  '',
				'file_id': 'my_model',
				'pattern': /my_model.js$/,
				'reqs':    ['backbone']

			}
		], 'underscore/backbone ordered files');

		var ra = reduce_atomized(files);

		t.deepEqual(ra, [
			{
				"target": "/vendor.js",
				"files":  ["/underscore.js", "/js/vendor/backbone-min.js"]
			},
			{
				"target": "",
				"files":  ["/my_model.js"]
			}
		], 'ra underscore/backbone');

		reg.reverse();
		ssr_atomize(reg, function (files) {

			t.deepEqual(files, [
				{
					'file':    '/underscore.js',
					'target':  '/vendor.js',
					'file_id': 'underscore',
					'pattern': /underscore(-min)?.js$/,
					'reqs':    []

				},
				{
					'file':    '/js/vendor/backbone-min.js',
					'target':  '/vendor.js',
					'file_id': 'backbone',
					'pattern': /backbone(-min)?.js$/,
					'reqs':    ['underscore']

				},
				{
					'file':    '/my_model.js',
					'target':  '',
					'file_id': 'my_model',
					'pattern': /my_model.js$/,
					'reqs':    ['backbone']

				}
			], 'underscore/backbone ordered files, after reversing reg');

			files = ['/js/vendor/backbone-min.js', '/a/new/file.js', '/underscore.js', '/my_model.js', '/underscore-min.js'];

			var reg = ssr_registry(sri_req, files);
			oreg = _.sortBy(reg, 'file_id');

			t.deepEqual(oreg, [
				{
					'file':    '/a/new/file.js',
					'target':  '',
					'file_id': '/a/new/file.js',
					'pattern': new RegExp('/a/new/file.js/'),
					'reqs':    []
				},
				{
					'file':    '/js/vendor/backbone-min.js',
					'target':  '/vendor.js',
					'file_id': 'backbone',
					'pattern': /backbone(-min)?.js$/,
					'reqs':    [
						'underscore'
					]
				},
				{
					'file':    '/my_model.js',
					'target':  '',
					'file_id': 'my_model',
					'pattern': /my_model.js$/,
					'reqs':    [
						'backbone'
					]
				},
				{
					'file':    '/underscore.js',
					'target':  '/vendor.js',
					'file_id': 'underscore',
					'pattern': /underscore(-min)?.js$/,
					'reqs':    [

					]
				}
			], 'register backbone prereqs with undefined file');

			ssr_atomize(reg, function (files) {

				t.deepEqual(files, [
					{
						"file":    "/a/new/file.js",
						"target":  "",
						"file_id": "/a/new/file.js",
						"pattern": new RegExp('/a/new/file.js/'),
						"reqs":    []
					},
					{
						"file":    "/underscore.js",
						"target":  "/vendor.js",
						"file_id": "underscore",
						"pattern": /underscore(-min)?.js$/,
						"reqs":    []
					},
					{
						"file":    "/js/vendor/backbone-min.js",
						"target":  "/vendor.js",
						"file_id": "backbone",
						"pattern": /backbone(-min)?.js$/,
						"reqs":    ["underscore"]
					},
					{
						"file":    "/my_model.js",
						"target":  "",
						"file_id": "my_model",
						"pattern": /my_model.js$/,
						"reqs":    ["backbone"]
					}
				], 'atomic backbone with undefined file');

				t.end();
			});

		})
	})

})