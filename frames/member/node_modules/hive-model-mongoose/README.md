Hive-model-mongoose
===================

Hive-model-mongoose is a superclass for mongoose model. It exists for several purposes:

1) to create a more REST-like interface for the mongoose model methods
2) to insulate all of the mongoose model methods from your particular model class to reduce collision.
3) to bundle a set of features with all models.

Note that in hive-model-mongoose, the assumption is that the models functions, not the records' native functions,
are called.

Note that though Mongooose_Model is a model , the only part of hive-model that is used is the dataspace,
which like Mongoose is also injected.

Injected Mongoose
-----------------
One important caveat is that mongoose is NOT bundled with this module. For consistency's sake mongoose is injected
into the configuration of each model's configuration.

This is because the database configuration is embedded into the definition of the mongoose model and is therefore
better assigned to an injected instance of that module than put into this module.

Added Functionality
-------------------

All models have "soft deletion" built in to the delete method. if Model.delete(record, callback, true) is called,
the models' delete flag is set to true, but the record itself is preserved.

