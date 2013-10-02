var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');

/* ------------ CLOSURE --------------- */

/* -------------- EXPORT --------------- */

module.exports = {

    on_validate: function (context, done) {

        if (!context._id) {
            context.add_message('No ID found', 'error');
            context.$go('/art/draw', done);
        } else {
            done();
        }
    },

    on_input: function (context, done) {
        var model = this.model('drawings');
        context.$out.set('can_edit', false);

        model.get(context._id, function (err, drawing) {
            if (!drawing) {
                context.add_message('cannot find drawing ' + context._id);
                context.$go('/art/draw', done);
            } else {
                var member = context.$session('member');
                if (!member) {
                    context.$out.set('can_edit', false);
                    if (drawing.public) {
                        context.$out.set('drawing', drawing);
                        done();
                    } else {
                        context.add_message('This is a private drawing; log in if this drawing is yours', 'error');
                        return context.$go('/art', done);
                    }
                } else if (member._id.toString() == drawing.creator.toString()) {
                    context.$out.set('drawing', drawing);
                    context.$out.set('can_edit', true);
                    done();
                } else {
                    if (drawing.public) {
                        context.$out.set('can_edit', false);
                    } else {
                        context.add_message('This is a private drawing', 'error');
                        return context.$go('/art', done);
                    }
                }

            }
        });
    },

    on_process: function (context, done) {
        done();
    },

    on_output: function (context, done) {
        done();
    }
}