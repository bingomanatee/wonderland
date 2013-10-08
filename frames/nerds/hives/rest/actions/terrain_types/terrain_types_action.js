var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var Q = require('q');

/* ------------ CLOSURE --------------- */

var global_terrain;

/* -------------- EXPORT --------------- */

module.exports = {
    on_get_input: function (context, done) {

        function _on_terrain_types(err, terrain_types) {
            context.terrain_types = terrain_types ? terrain_types.map(function (terrain_type) {
                return terrain_type.toJSON();
            }) : null;
            done(err);
        }

        Q.when(this.model('nerds_terrain_types'), function (terrain_types_model) {
          //  console.log('ttm: %s', util.inspect(terrain_types_model));
            if (!terrain_types_model){
                return done('no terrain types model')
            }
            console.log('tta 1: model found');
            if (context._id) {
                terrain_types_model.get(context._id, function (err, terrain_type) {
                    context.terrain_type = terrain_type.toJSON();
                    done();
                });
            } else if (context.global || (!context.game)) {
                if (global_terrain) {
                    context.terrain_types = global_terrain;
                    done();
                } else {
                    console.log('tta 2: getting globals');
                    terrain_types_model.find({global: true}, function (err, global) {
                        console.log('tta 3: globals got');
                        context.terrain_types = global_terrain = global.map(function (terrain) {
                            return terrain.toJSON();
                        });
                        done();
                    });
                }
            } else {
                terrain_types_model.find({game: context.game}, function (err, game_terrain) {
                    if (!game_terrain) {
                        game_terrain = [];
                    }

                    function _put_game_terrain() {
                        context.terrain_types = game_terrain.concat(global_terrain);
                        done();
                    }

                    if (!global_terrain) {
                        terrain_types_model.find({global: true}, function (err, global) {
                            global_terrain = global.map(function (terrain) {
                                return terrain.toJSON();
                            });
                            _put_game_terrain();
                        });

                    } else {
                        _put_game_terrain();
                    }

                });
            }
        });

    },

    on_get_output: function (context, done) {
        context.$out = context._id ? context.terrain_type : context.terrain_types;
        context.$send(done);
    },

    /* --------------- POST ------------------- */

    on_post_validate: function (context, done) {

        this.model('member').ican(context, ['edit nerds games'], done, {
            go: '/',
            message: 'You do not have authorization to administer nerds games',
            key: 'error'
        })
    },

    on_post_input: function (context, done) {
        Q.when(this.model('nerds_terrain_types'), function (terrain_types_model) {
            console.log('terrain_types model found');
            try {

                var terrain_type = terrain_types_model.pick(context);
                console.log('making terrain_type %s', util.inspect(terrain_type));

                terrain_types_model.put(terrain_type, function (err, terrain_type) {
                    context.terrain_type = terrain_type.toJSON();
                    console.log('created terrain_type %s', util.inspect(context.terrain_type));
                    done();
                });
            } catch (err) {
                done(err);
            }

        });
    },

    on_post_output: function (context, done) {
        context.$send(context.terrain_type, done);
    },

    /* --------------- PUT ------------------- */

    on_put_validate: function (context, done) {

        this.model('member').ican(context, ['edit nerds games'], done, {
            go: '/',
            message: 'You do not have authorization to administer nerds games',
            key: 'error'
        })
    },

    on_put_input: function (context, done) {
        Q.when(this.model('nerds_terrain_types'), function (terrain_types_model) {

            var terrain_type = terrain_types_model.pick(context);
            console.log('making terrain_type %s', util.inspect(terrain_type));

            terrain_types_model.revise(terrain_type, function (err, terrain_type) {
                context.terrain_type = terrain_type.toJSON();
                console.log('created terrain_type %s', util.inspect(context.terrain_type));
                done();
            });

        });
    },

    on_put_output: function (context, done) {
        context.$send(context.terrain_type, done);
    }
};