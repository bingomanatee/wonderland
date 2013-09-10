var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var Q = require('q');

/* ------------ CLOSURE --------------- */

/* -------------- EXPORT --------------- */

module.exports = {
    on_get_input: function (context, done) {

        Q.when(this.model('nerds_places'), function (places_model) {

            if (context._id) {
                places_model.get(context._id, function (err, place) {
                    context.place = place.toJSON();
                    done();
                });
            } else {
                places_model.all(function (err, places) {
                    context.places = places.map(function (place) {
                        return place.toJSON();
                    });
                    done();
                })
            }
        });

    },

    on_get_output: function (context, done) {
        context.$out = context._id ? context.place : context.places;
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
        Q.when(this.model('nerds_places'), function (places_model) {

            var place = _.pick(context, 'name', 'type', 'description', 'size', 'game');
            console.log('making place %s', util.inspect(place));

            places_model.put( place, function (err, place) {
                context.place = place.toJSON();
                console.log('created place %s', util.inspect(context.place));
                done();
            });

        });
    },

    on_post_output: function (context, done) {
        context.$send(context.place, done);
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
        Q.when(this.model('nerds_places'), function (places_model) {

            var place = _.pick(context, 'name', 'type', 'description', 'size', 'game');
            console.log('making place %s', util.inspect(place));

            places_model.revise( place, function (err, place) {
                context.place = place.toJSON();
                console.log('created place %s', util.inspect(context.place));
                done();
            });

        });
    },

    on_put_output: function (context, done) {
        context.$send(context.place, done);
    }
};