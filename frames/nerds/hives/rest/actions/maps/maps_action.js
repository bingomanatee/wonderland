var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var Q = require('q');

/* ------------ CLOSURE --------------- */

/* -------------- EXPORT --------------- */

module.exports = {
    on_get_input: function (context, done) {
        console.log('maps_action get input');
        Q.when(this.model('nerds_maps'), function (map_model) {
            console.log('maps_action get model %s', util.inspect(map_model));

            if (context._id) {
                map_model.get(context._id, function (err, map) {
                    context.map = map;
                    done();
                });
            } else if (context.game) {
                map_model.find({game: context.game}, '-hexes -roads -cities', function (err, maps) {
                    context.maps = maps;
                    done();
                })
            } else {
                map_model.all('-hexes -roads -cities', function (err, maps) {
                    context.maps = maps;
                    done();
                })
            }
        });

    },

    on_get_output: function (context, done) {
        context.$out = context._id ? context.map.toJSON() : context.maps.map(function (map) {
            return map.toJSON();
        });

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
        Q.when(this.model('nerds_maps'), function (map_model) {
            var map = map_model.pick(context);

            map_model.put(map, function (err, map) {
                context.map = map.toJSON();
                done();
            });

        });
    },

    on_post_output: function (context, done) {
        context.$send(context.map, done);
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
        Q.when(this.model('nerds_maps'), function (map_model) {

            var map = map_model.pick(context);
            map_model.revise(map, function (err, map) {
                context.map = map.toJSON();
                console.log('created map %s', util.inspect(context.map));
                done();
            });

        });
    },

    on_put_output: function (context, done) {
        context.$send(context.map, done);
    }
};