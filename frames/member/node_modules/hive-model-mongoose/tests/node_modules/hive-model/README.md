hive-model
==========

A javascript based database for local memory based storage of data or resources.

Models are lists of data a la backbone collections.
They can contain any sort of data.


Models are not designed for any specific backend. They are designed to
provide real-time node repositories of records for transient information management.

There is no structural schema for model data or structure, beyond the existence
of a unique identifying key identified by the _pk property (that defaults to 'id').
Although the default _make_pk assumes integer based IDs, you can easily override this
for a different index basis.

Dataspaces
----------

Models are stored in dataspaces, which ensure/maintain uniqueness of model name within the dataspace.
Dataspaces are hive-components that store models by name in their config.

Queries
-------

Many methods of the model have optional callbacks that if omitted result in a query object being returned.
Query objects allow you to compound filtering operations such as

<code>
	var hive_model = require('hive-model');

	var ds = hive_model.Dataspace();

	var myModel = hive_model.Model({data: [
			{id: 1, name: 'alpha', weight: 200},
			{id: 2, name: 'beta', weight: 100},
			{id: 3, name: 'delta', weight: 0},
			{id: 4, name: 'gamma': weight: 100},
		]
	}, {name: 'foos'}, ds);

	var lightweights = myModel.find(function(record){ return record.weight <= 100; });

	// note - lightweights is not an array of objects: it is a query object.
	// There is no guarantee of ordering of the records returned .. yet.

	var lightweight_records = lightweights.records();

	// these are the records from the query object.

	var sorted_lightweights = lightweights.sort('name');

	// sorted_lightweights is another query;

	var sorted_lightweight_records = sorted_lightweights.records();

	// HERE we have the desired result - all foos that weight up to 100, ordered by name.

	// the practical way to use queries is to chain commands and end with a records output.

	var slr_faster = myModel.find(function(record){ return record.weight <= 100;}).sort('name').records()

</code>

Creating a Model
----------------

Models are instances of the hive-component Component system.
A hive-component Component is created with the following API:

<code>
	var hive_component = require('hive-component');

	var mixins = {
		increment: function(){
			var c = this.get_config('value') + 1;
			this.set_config(c);
			return c;
		}
	}

	var config = {
		value: 0;
	}

	// you can think of the API as "hive_component({methods}, {properties})" -- usually -- but once in a while
	// you will need to pass data in as a mixin, as is the case with model data.
	var MyCompFactory = hive_component(mixins, config);

	var mycomp = MyComp():

	mycomp.get_config('value') // 0;
	mycomp.increment();
	mycomp.get_config('value') // 1;
</code>

The Model function allows for a third argument, to pass the dataspace in seperately, as shown aboe.
You can also create a service that buries the dataspace in closure as in:

<code>
	var hive_model = require('hive-model');

	var ds = hive_model.Dataspace();

	var ds_factory = Model.factory(ds);


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

	var bar_model = ds_factory(_model_bar_mixin, {_pk: 'id'});
</code>

THE NAME IS REQUIRED in the first parameter. Its how dataspace indeses the model. You don't have to pass data
in, though if you have it its a convenient way to start up your model.

The second parameter (config) has no mandataory properties, unless you want to use an object whose _pk (primary key)
is different than "id".

Adding Data
-----------

You can add data to a model in one of three ways:

1) initally, as in the example above.
2) record by record via my_model.put({foo: 1, bar: 2});
3) in an array of data viar my_model.add([{}, {}]);

Each of these actions will emit('record', record) for each individual record. If you want to hook your data to a real
 repo, you can do so by listening for this event.

 Updating Data
 -------------

 Putting data in that already has a PK value will overwrite / update a record; you can also call update
 to update a single record based on its ID, or by calling my_model.update(filter_function,

