var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var Q = require('q');

/* ------------ CLOSURE --------------- */

/* -------------- EXPORT --------------- */

module.exports = {
    on_get_input: function (context, done) {

        Q.when(this.model('nerds_skills'), function (skills_model) {
            skills_model.all(function (err, skills) {
                context.skills = skills.map(function (skill) {
                    return skill.toJSON();
                });
                done();
            })
        });
    },

    on_get_output: function (context, done) {
        context.$out = context.skills;
        context.$send(done);
    }
}