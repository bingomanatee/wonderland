var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');

/* ------------ CLOSURE --------------- */

/* -------------- EXPORT --------------- */

module.exports = {

    on_validate: function (context, done) {
        done();
    },

    on_input: function (context, done) {
        var member = context.$session('member');
        context.$out.set('member', member);
        if (context._id) {
            var model = this.model('drawings');
            model.get(context._id, function (err, drawing) {
                if (!drawing) {
                    context.add_message('cannot find ' + context._id, 'error');
                    context.$go('/art/draw', done);
                } else if (member && model.can_edit(drawing, member)) {
                    context.drawing = drawing;
                    done();
                } else {
                    context.add_message('cannot edit ' + context._id, 'error');
                    context.$go('/art/draw', done);
                }
            });
        } else {
            done();
        }
    },

    on_process: function (context, done) {
        done();
    },

    on_output: function (context, done) {
        if (context.drawing) {
            context.$out.set('drawing', context.drawing);
        } else {
            context.$out.set('drawing', false);
        }
        done();
    }
}