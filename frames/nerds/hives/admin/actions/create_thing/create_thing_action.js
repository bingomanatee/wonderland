var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');

/* ------------ CLOSURE --------------- */

/* -------------- EXPORT --------------- */

module.exports = {

    on_validate: function (context, done) {
        //@TODO: allow more restrictive ownership of game content

        this.model('member').ican(context, ['edit nerds games'], done, {
            go: '/',
            message: 'You do not have authorization to administer nerds games',
            key: 'error'
        })
    },

    on_input: function (context, done) {
        done();
    },

    on_process: function (context, done) {
        done();
    },

    on_output: function (context, done) {
        context.$out.set('game_id', context._id);
        done();
    }
}