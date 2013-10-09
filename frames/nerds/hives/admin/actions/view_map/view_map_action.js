var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var Q = require('q');

/* ------------ CLOSURE --------------- */

/* -------------- EXPORT --------------- */

module.exports = {

    on_validate: function (context, done) {
        //@TODO: allow more restrictive ownership of game content

        if (!context._id) {
            context.add_message('No Game ID found', 'error');
            return context.$go('/admin');
        }

        this.model('member').ican(context, ['edit nerds games'], done, {
            go: '/',
            message: 'You do not have authorization to administer nerds games',
            key: 'error'
        })
    },

    on_input: function (context, done) {

        Q.when(this.model('nerds_maps'), function (maps_model) {

            maps_model.get(context._id, function (err, map) {
                if (err) {
                    context.add(err.toString(), 'err');
                     context.$go('/admin');
                } else if (!map) {
                    context.add_message('No Map found for ' + context._id, 'error');
                     context.$go('/admin');
                } else {
                    console.log('map found: %s', util.inspect(map).slice(0, 100));
                    context.map = map;
                    //@TODO: check ownership
                    maps_model.map_game(map, function(err, game){
                        context.game = game;
                        done();
                    });
                }
            });
        });
    },

    on_process: function (context, done) {
        done();
    },

    on_output: function (context, done) {
        context.$out.set('game', context.game.toJSON());
        context.$out.set('map', context.map.toJSON());
        done();
    }
}