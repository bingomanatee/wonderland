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

            games_model.all(function (err, games) {
                context.games = games.map(function (game) {
                    return game.toJSON();
                });
                done();
            })
        });

    },

    on_get_output: function (context, done) {
        context.$out = context.games;
        context.$send(done);
    }
}