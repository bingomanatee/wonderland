var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var Q = require('q');

/* ------------ CLOSURE --------------- */

/* -------------- EXPORT --------------- */

module.exports = {
    on_get_input: function (context, done) {

        Q.when(this.model('nerds_games'), function (games_model) {

            if (context._id) {
                games_model.get(context._id, function (err, game) {
                    context.game = game.toJSON();
                    done();
                });
            } else {
                games_model.all(function (err, games) {
                    context.games = games.map(function (game) {
                        return game.toJSON();
                    });
                    done();
                })
            }
        });

    },

    on_get_output: function (context, done) {
        context.$send(context._id ? context.game : context.games, done);
    },

    /* --------------- VALIDATE ------------------- */

    on_put_validate: function (context, done) {

        if (!context._id) {
            return done('No ID found');
        }

        this.model('member').ican(context, ['edit nerds games'], done, {
            go: '/',
            message: 'You do not have authorization to administer nerds games',
            key: 'error'
        })
    },

    on_put_input: function (context, done) {
        Q.when(this.model('nerds_games'), function (games_model) {

            var game = _.pick(context, '_id', 'name', 'genre', 'description');
            console.log('updating game %s', util.inspect(game));

            games_model.revise( game, function (err, game) {
                context.game = game.toJSON();
                console.log('updated %s', util.inspect(context.game));
                done();
            });

        });
    },

    on_put_output: function (context, done) {
        context.$send(context.game, done);
    }
};