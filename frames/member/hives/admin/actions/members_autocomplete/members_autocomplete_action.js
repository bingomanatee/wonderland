var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

/* ************************************
 * returns a list of member names based on a string search fragment.
 * Potentially a minor security breach; no significant info is leaked
 * but it does create a tool for data miners.
 *
 * ************************************ */

/* ******* CLOSURE ********* */

var _m = _.template('<%= displayName %> <%= oauth %> [<%= _id %>]');
var _p = _.template(' (<%= provider %>: <%= displayName %>) ');

var short = {
    facebook: 'FB',
    twitter: 'T'
};

function format_names(members) {
    return members.map(function (member) {

        var data = {
            _id: member._id,
            displayName: member.displayName,
            oauthProfiles: member.oauthProfiles
        };

        data.label = _m({_id: member._id,
            displayName: member.displayName,
            oauth: _.reduce(member.oauthProfiles, function (out, prof) {

                return out + _p({
                    provider: short[prof.provider] || prof.provider,
                    displayName: prof.displayName
                });
            }, '')
        });

        return data;
    });
}

/* ********* EXPORTS ******** */
//@TODO: examine security closer
module.exports = {

    /* *********** GET ********** */

    on_validate: function (context, done) {
        if (!context.fragment) {
             context.$send([], done);
        } else {
            done();
        }

    },

    on_input: function (context, done) {
        var model = this.model('member');
        var query = {
            displayName: { $regex: context.fragment, $options: 'i' },
            'oauthProfiles.provider' : context.provider
        };

        console.log('ac query: %s', util.inspect(query));
        model.find(query,
            function (err, members) {
                if (err) {
                    done(err);
                } else {
                    context.$send(format_names(members), done);
                }
            })
    }

}; // end action