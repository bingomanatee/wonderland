var util = require('util');
var crypto = require('crypto');
var _ = require('underscore');

function encode(tid, sid) {
    console.log('tid: %s, sid: %s', tid, sid);
    return crypto.pbkdf2Sync(tid, sid, 5, 20).toString()
}

module.exports = {
    on_get_validate: function (context, done) {
        done();
    },

    on_get_input: function (context, done) {
        context.nonce = context.$session('nerds_twitter_nonce');
        if (context.nonce) {
            console.log('have tn: %s', util.inspect(context.nonce));
            return done();
        }

        context.twitter_user = false;
        var member = context.$session('member');

        if (member) {
            var twitter_user = _.find(member.oauthProfiles, function (p) {
                return p.provider == 'twitter';
            });

            if (twitter_user) {
                context.twitter_user = twitter_user;
            }
        }
        done();
    },

    on_get_process: function (context, done) {
        if (context.nonce) {
            console.log('have tn2: %s', util.inspect(context.nonce));
            return done();
        } else if (context.twitter_user) {

            context.nonce = {
                twitter_user: context.twitter_user,
                key: encode(context.twitter_user._id, context.$req.sessionID)
            };

            context.$session_set('nerds_twitter_nonce', context.nonce);

        } else {
            console.log('no tid');
        }
        done();
    },

    on_get_output: function (context, done) {
        context.$out.set('twitter_nonce', context.nonce);
        context.$out.set('game_id', context._id);
        done();
    }

};