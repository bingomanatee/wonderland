var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var Q = require('q');

/* ------------ CLOSURE --------------- */

/* -------------- EXPORT --------------- */

module.exports = {
    on_get_input: function (context, done) {

        function _on_things(err, things) {
            context.things = things ? things.map(function (thing) {
                return thing.toJSON();
            }) : null;
            done(err);
        }

        Q.when(this.model('nerds_things'), function (things_model) {
            if (context._id) {
                things_model.get(context._id, function (err, thing) {
                    context.thing = thing.toJSON();
                    done();
                });
            } else if (context.global) {
                things_model.find({global: true}, '-sprites', _on_things);
            } else {
                things_model.all(_on_things)
            }
        });

    },

    on_get_output: function (context, done) {
        context.$out = context._id ? context.thing : context.things;
        context.$send(done);
    },

    /* --------------- POST ------------------- */

    on_post_validate: function (context, done) {

        this.model('member').ican(context, ['edit nerds games'], done, {
            go: '/',
            message: 'You do not have authorization to administer nerds games',
            key: 'error'
        })
    },

    on_post_input: function (context, done) {
        Q.when(this.model('nerds_things'), function (things_model) {
            console.log('things model found');
            try {

                var thing = things_model.pick(context);
                console.log('making thing %s', util.inspect(thing));

                things_model.put(thing, function (err, thing) {
                    context.thing = thing.toJSON();
                    console.log('created thing %s', util.inspect(context.thing));
                    done();
                });
            } catch (err) {
                done(err);
            }

        });
    },

    on_post_output: function (context, done) {
        context.$send(context.thing, done);
    },

    /* --------------- PUT ------------------- */

    on_put_validate: function (context, done) {

        this.model('member').ican(context, ['edit nerds games'], done, {
            go: '/',
            message: 'You do not have authorization to administer nerds games',
            key: 'error'
        })
    },

    on_put_input: function (context, done) {
        Q.when(this.model('nerds_things'), function (things_model) {

            var thing = things_model.pick(context);
            console.log('making thing %s', util.inspect(thing));

            things_model.revise(thing, function (err, thing) {
                context.thing = thing.toJSON();
                console.log('created thing %s', util.inspect(context.thing));
                done();
            });

        });
    },

    on_put_output: function (context, done) {
        context.$send(context.thing, done);
    }
};