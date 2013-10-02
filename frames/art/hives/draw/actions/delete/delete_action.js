var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');

/* ------------ CLOSURE --------------- */

/* -------------- EXPORT --------------- */

module.exports = {

    on_validate: function (context, done) {
        if (!context.$session('member')) {
            return done('You must be logged in to save drawings');
        } else if (!context._id) {
            return done('no ID found');
        } else {
            done();
        }
    },

    on_input: function (context, done) {

        var model = this.model('drawings');

        model.get(context._id, function (err, drawing) {
            if (err) {
                return done(err);
            } else if (!drawing) {
                return done('cannot find ' + context._id);
            }

            if (drawing.creator.toString() != context.$session('member')._id.toString()) {
                return done('You did not create the original version of drawing ' + context._id);
            }

            context.drawing = drawing;

            done();

        });

    },

    on_process: function (context, done) {

        var model = this.model('drawings');
        model.delete(context._id, done, true);
    },

    on_output: function(context, done){

        context.add_message('drawing ' + context._id + 'deleted', 'info');
        context.$go('/art');

    }
}