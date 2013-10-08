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

        Q.when(this.model('nerds_games'), function (games_model) {

            games_model.get(context._id, function (err, game) {
                if (err) {
                    context.add(err.toString(), 'err');
                    return context.$go('/admin');
                } else if (!game) {
                    context.add_message('No Game found for ' + context._id, 'error');
                    return context.$go('/admin');
                } else {
                    context.game = game;
                    //@TODO: check ownership
                    done();
                }
            });
        });
    },

    on_process: function (context, done) {
        done();
    },

    on_output: function (context, done) {
        context.$out.set('game', context.game.toJSON());
        done();
    }
}