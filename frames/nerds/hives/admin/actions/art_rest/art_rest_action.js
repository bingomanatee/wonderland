var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');

/* ------------ CLOSURE --------------- */

/* -------------- EXPORT --------------- */

module.exports = {

    on_get_input: function (context, done) {
        var model = this.model('drawings');

        if (context._id) {
            model.get(context._id, function (err, drawing) {
                context.drawing = drawing;
                done();
            })
        } else {
           done('no _id');
        }
    },

    on_get_process: function (context, done) {
        context.$send(context.drawing, done);
    }

}