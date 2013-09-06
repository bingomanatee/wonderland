var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var Gate = require('gate');

var hm = require('./../index');
var Model = hm.Model;
var Dataspace = hm.Dataspace;

var beta = {id: 2, name: 'beta', gender: 'm', created: 200};
var gamma = {id: 3, name: 'gamma', gender: 'f', created: 400};

var _model_mixin = {
	name: 'foo_model',
	data: [
		{id: 1, name: 'alpha', gender: 'm', created: 100},
		beta,
		gamma,
		{id: 4, name: 'delta', gender: 'f', created: 300},
		{id: 5, name: 'omega', gender: 'f', created: 100}
	]

}

var rec_count = 50;

var _model_bar_mixin = {
	name: 'bar_model',
	data: [
		{id: 1, name: 'a', weight: 100}
		,
		{id: 2, name: 'b', weight: 150}
		,
		{id: 3, name: 'c', weight: 200}
		,
		{id: 4, name: 'aa', weight: 125}
		,
		{id: 5, name: 'ab', weight: 175}
		,
		{id: 6, name: 'ba', weight: 50}
		,
		{id: 7, name: 'bb', weight: 75}
	]

}

var dataspace = Dataspace();

tap.test('query_obj', function (t) {
	var ds_factory = Model.factory(dataspace);

	var bar_model = ds_factory(_model_bar_mixin, {_pk: 'id'});

	var cs = bar_model.where('name', 'c').records();
	t.equal(cs[0].id, 3, 'where got record c');

	var gate = Gate.create();
	var l = gate.latch();

	bar_model.where('name', 'c', function (err, cs) {
		t.equal(cs[0].id, 3, 'where got record c');
		l();
	});

	var l2 = gate.latch();
	bar_model.where('weight', '>', 100).sort('weight').records(function (err, data) {
		_.each([4, 2, 5, 3], function (id, i) {
			t.equal(data[i].id, id, 'id of sorted large weight ' + i + ' == ' + id);
		})
		l2();
	});

	var l22 = gate.latch();
	bar_model.where('weight', '>', 100).sort('weight', true).records(function (err, data) {
		_.each([4, 2, 5, 3].reverse(), function (id, i) {
			t.equal(data[i].id, id, 'id of sorted large rev weight ' + i + ' == ' + id);
		})
		l2();
	});

	var l3 = gate.latch();
	bar_model.where('weight', '>', 100).sort('weight').slice(2).records(function (err, data) {
		_.each([ 5, 3], function (id, i) {
			t.equal(data[i].id, id, 'id of sorted large slice weight ' + i + ' == ' + id);
		})
		l3();
	});

	gate.await(function () {
		t.end();
	});

});

if (true) {
	tap.test('get and put', function (t) {

		Model(_model_mixin, {_pk: 'id'}, dataspace, function (err, model) {
			model.get(3, function (err, record) {
				t.deepEqual(record, gamma, 'record id 3 == gamma');

				var fifi = {id: 6, name: 'fifi', created: 200};
				model.put(fifi, function (err, ff) {
					t.deepEqual(fifi, ff, 'fifi in == fifi out');
					model.get(6, function (err, ff3) {
						if (err) throw err;
						t.deepEqual(ff3, fifi, 'found fifi');

						model.count(function (err, c) {
							t.equal(c, 6, 'start with six records');

							model.delete(2, function (err, record) {
								t.deepEqual(record, beta, 'return from delete == beta');
								model.count(function (err, c2) {
									t.equal(c2, 5, 'after delete, five records left');
									t.end();
								})
							})
						})
					})
				});
			})
		})
	})
}

if (true) {
	tap.test('query', function (t) {

		var model = Model(_model_mixin, {_pk: 'id'}, dataspace);

		model.init(function () {

			model.find({created: 100}, function (err, hits) {
				//console.log('hit on created:100 %s', util.inspect(hits));
				var names = _.sortBy(_.pluck(hits, 'name'), _.identity);
				t.deepEqual(names, ['alpha', 'omega'], 'found created at 100');
				model.find({created: 100, gender: 'f'}, function (err, hits2) {

					//console.log('hit on created:100 %s', util.inspect(hits));
					var names = _.sortBy(_.pluck(hits2, 'name'), _.identity);
					t.deepEqual(names, ['omega'], 'found f created at 100');
					t.end();
				})
			})
		})
	});
}

var alpha = 'abcdefghijklmnopqrstuvwxyz'.split('');
var word = function () {
	var letters = [];
	do {
		letters.push(_.shuffle(alpha).slice(0, 2))
	} while (Math.random() > 0.25);
	return _.flatten(letters).join('').slice(0, 8);
};

tap.test('dump data', function (t) {

	function _make_dumper_data() {
		return _.map(_.range(1, rec_count + 1), function (id) {
			var w = word();
			return {
				id:     id,
				name:   w,
				weight: Math.floor(1000 * Math.random())
			}
		})
	}

	var dump_path = path.resolve(__dirname, './../test_resources/model/dumper/data')

	var dumper_model = Model({
		name: 'dumper',
		data: _make_dumper_data()
	}, {dump_path: dump_path}, dataspace);

	dumper_model.dump(function (err, result) {

		if (err) {
			console.log('error: ', err);
			return t.end();
		}

		var dumper_loader_model = Model({
				name: 'dumper_loader'
			}, { dump_path: dump_path, dump_name: 'dumper'},
			dataspace);

		dumper_loader_model.load(function (err) {
				if (err) {
					return t.end();
				}

				dumper_loader_model.count(function (err, c) {
					t.equals(c, rec_count, 'rec_count records uploaded');
					var gate = Gate.create();

					dumper_loader_model.all(function (err, data) {
						_.each(data, function (record) {
							var l = gate.latch();

							dumper_model.get(record.id, function (err, original) {
								if (err) {
									console.log('err: %s', err.message);
								}

								t.deepEqual(original, record, 'comparing dump record ' + record.id);
								l();
							})

						});

						gate.await(function () {
							t.end();
						})

					})

				})
			}

		)
	})
});
