var tap = require('tap');
var Config = require('./../index');


tap.test('merging properties', function(t){
	var config = new Config({a: [1,2], b: {foo: 'bar'}});
	config.set('a', [3,4]);
	config.set('b', {alpha: 'beta'})

	t.deepEqual(config.get('a'), [1,2,3,4], 'arrays should merge');

	t.deepEqual(config.get('b'), {foo: 'bar', alpha: 'beta'}, 'objects should merge');

	t.end();
})