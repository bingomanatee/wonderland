var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');

/* ------------ CLOSURE --------------- */

/* -------------- EXPORT --------------- */

module.exports = {

    on_get_input: function (context, done) {
        var model = this.model('drawings');
        var member = context.$session('member');

        if (context._id) {
            model.get(context._id, function (err, drawing) {
                if (err) {
                    done(err);
                } else if (drawing) {
                    if (!drawing.public) {
                        if (!member) {
                            done('Viewing private drawing');
                        } else {
                            var id = member._id.toString();
                            var creator = drawing.creator.toString();
                            if (id == creator) {
                                context.drawing = drawing;
                                done();
                            } else {
                                context.$send({error: 'This drawing is private.'}, done);
                            }
                        }
                    } else {
                        context.drawing = drawing;
                        done();
                    }
                } else {
                    context.$send({error: 'cannot find drawing ' + context._id});
                }
            })
        } else {
            model.find({public: true, deleted: false}, function (err, drawings) {
                console.log('public drawings: ', util.inspect(drawings));
                if (err) return done(err);
                context.drawings = drawings ? drawings : [];
                if (member) {
                    model.find({public: false, creator: member._id, deleted: false}, function (err, my_drawings) {
                        if (my_drawings && my_drawings.length) {
                            context.drawings = context.drawings.concat(my_drawings);
                            done();
                        } else {
                            done();
                        }
                    });
                } else {
                    done();
                }
            });
        }
    },

    on_get_process: function (context, done) {
        if (context._id) {
            context.$send(context.drawing, done);
        } else {
            context.$send(context.drawings, done);
        }
    },

    /* ***************** POST *************** */

    on_post_validate: function (context, done) {
        done();
    },

    on_post_input: function (context, done) {
        context.drawing = _.pick(context, 'clut', 'tokens', 'shapes', 'name', 'description', 'public', 'creator');
        done();
    },

    on_post_process: function (context, done) {
        var model = this.model('drawings');
        model.put(context.drawing, function (err, drawing) {
            if (err) {
                done(err);
            } else {
                context.drawing_saved = drawing;
                done();
            }
        });
    },

    on_post_output: function (context, done) {
        context.$send(context.drawing_saved.toJSON(), done);
    },

    /* ***************** DELETE *************** */

    on_delete_validate: function (context, done) {
        if (!context.$session('member')) {
            return done('You must be logged in to save drawings');
        } else if (!context._id) {
            return done('no ID found');
        } else {
            done();
        }
    },

    on_delete_input: function (context, done) {

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

    on_delete_process: function (context, done) {


        var model = this.model('drawings');
        model.delete(context._id, done, true);
    },

    /* ***************** PUT *************** */

    on_put_validate: function (context, done) {
        if (!context.$session('member')) {
            return done('You must be logged in to save drawings');
        } else if (!context._id) {
            return done('no ID found');
        } else {
            done();
        }
    },

    on_put_input: function (context, done) {

        var model = this.model('drawings');

        model.get(context._id, function (err, drawing) {
            if (err) {
                return done(err);
            }

            var drawing_data = _.pick(context, 'clut', 'tokens', 'shapes', 'name', 'description', 'public');

            if (drawing.creator.toString() != context.$session('member')._id.toString()) {
                return done('You did not create the original version of drawing ' + context._id);
            }

            delete drawing_data.creator;

            _.extend(drawing, drawing_data);

            context.drawing = drawing;

            done();

        });

    },

    on_put_process: function (context, done) {
        var model = this.model('drawings');
        model.put(context.drawing, function (err, drawing) {
            if (err) {
                done(err);
            } else {
                context.drawing_saved = drawing;
                done();
            }
        });
    },

    on_put_output: function (context, done) {
        context.$send(context.drawing_saved.toJSON(), done);
    }
}