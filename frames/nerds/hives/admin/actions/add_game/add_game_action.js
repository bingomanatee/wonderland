var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var Q = require('q');

/* ------------ CLOSURE --------------- */

/* -------------- EXPORT --------------- */

module.exports = {
    on_put_input: function(context, done){

        console.log('context: %s', util.inspect(context, false, 0));
        context.game = _.pick(context, 'name', 'genre');
        done();

    },

    on_put_process: function(context, done){
        Q.when(this.model('nerds_games'), function(games_model){
            console.log('saving %s', util.inspect(context.game));
            games_model.put(context.game, function(err, game){
                context.game = game.toJSON();
                done();
            })
        });

    },

    on_put_output: function(context, done){
        context.$out.setAll(context.game);
        context.$send(done);
    }
}