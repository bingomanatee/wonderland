var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var Mongoose_Model = require('hive-model-mongoose');
var Gate = require('gate');

/* ************************************
 * a member identity. note that member data is linked to but not identical to
 * an oauth user. It is possible to have more than one oauth profile for a user
 * though this has not yet been tested.
 *
 * @TODO: the _id of the oauth profile user is from different databases so there is a minute chance of collisions.
 * ************************************ */

/* ******* CLOSURE ********* */

var member_profile = require(path.resolve(__dirname, 'schema/member_profile'));
var oauth_user_profile = require(path.resolve(__dirname, 'schema/oauth_user_profile'));

/* ********* EXPORTS ******** */

var model;
module.exports = function (apiary, cb) {

    if (model){
        return cb(null, model);
    }

	var mongoose = apiary.get_config('mongoose');
	member_profile.oauthProfiles = [new mongoose.Schema(oauth_user_profile)];
    var member_profile_schema = new mongoose.Schema(member_profile);
    member_profile_schema.methods.setting = function(name, value){
        if (!this.options){
            this.options = [];
        }

        var setting = _.find(this.options, function(o){ return o.name == name});

        if(arguments.length < 2){
            return setting ? setting.value : null;
        } else if (!setting){
            setting = {name: name, value: value};
            this.settings.push(setting);
        } else {
            setting.value = value;
        }

        this.markModified('settings');

        this.save();

        return setting.value;
    };


	function _can(has_actions, need_actions, callback) {
		console.log('god mode: %s', apiary.get_config('god_mode'));
		if (apiary.get_config('god_mode')){
			return callback(null, true);
		}
		callback(null, _.every(need_actions, function (action) {
			return _.contains(has_actions, action);
		}))
	}

	function can(member, actions, callback) {
		if (apiary.get_config('god_mode')){
			return callback(null, true);
		}

		if (!member || !member.roles || !member.roles.length) {
			callback(null, false);
		} else if (!member.role_actions) {
			var member_roles = apiary.model('member_role');
			member_roles.role_actions(member.roles, function (err, role_actions) {
				member.role_actions = role_actions;
				_can(role_actions, actions, callback);
			})
		} else {
			_can(member.role_actions, actions, callback);
		}
	}

	function ican(ctx, actions, if_can, if_cant) {

		function _resolve(act) {
			if (_.isFunction(act)) {
				act();
			} else {
				if (act.message){
					ctx.add_message(act.message, act.key || 'error');
				}
				ctx.$go(act.go);
			}
		}

		this.can(ctx.$session('member'), actions, function (err, can) {
			if (can) {
				_resolve(if_can);
			} else {
				_resolve(if_cant);
			}
		});
	}

	/**
	 * fetches or creates a member record from oauth.
	 * Note, if more than one record is associated with the oAuth,
	 * an array is returned and the third parameter is true.
	 *
	 * @param oAuth {object}
	 * @param callback {function}(err, member(s), foundMultipleMembers)
	 */
	function add_from_oauth(oAuth, callback) {

		model.get_from_oauth(oAuth, function (err, oldMembers) {
			// @TODO: refresh data
			if (err) {
				callback(err);
			} else if (oldMembers && oldMembers.length) {
				if (oldMembers.length > 1) {
					callback(null, oldMembers[0], true);
				} else {
					callback(null, oldMembers);
				}
			} else {

				var id = oAuth._id ? oAuth._id : oAuth.id;
				oAuth._id = id;
				oAuth.primary = true;
				var data = {
					displayName:   oAuth.displayName,
					oauthProfiles: [oAuth]
				};

				model.put(data, function (err, member) {
					if (member) {
						member = [member];
					} else {
						member = [];
					}
					callback(err, member);
				});
			}
		});
	}

	function get_from_oauth(oAuth, callback) {
		var id = oAuth._id ? oAuth._id : oAuth.id;
		if (!oAuth.provider) {
			callback(new Error('oauth must have provider'));
		} else {
			var provider = oAuth.provider;
			var identity = {
				_id:      id,
				provider: provider};
			console.log('seeking identity %s', util.inspect(identity));

			this.find({
				oauthProfiles: {
					"$elemMatch": identity
				}
			}, callback)
		}
	}

	function primary_oauth (member){
		if (!member){
			throw new Error('cannot find primary_oauth of undefined');
		}
		var primary = _.find(member.oauthProfiles, function(profile){
			return profile.primary;
		})
		return primary || _.first(member.oauthProfiles);
	}

	Mongoose_Model(
		{
			name:           'member',
			add_from_oauth: add_from_oauth,
			get_from_oauth: get_from_oauth,
			primary_oauth: primary_oauth,
			can:            can,
			ican:           ican
		}
		, {
			mongoose:   mongoose,
			schema_def: member_profile_schema
		},
		apiary.dataspace,
		function (err, member_model) {
			model = member_model;
			cb(null, model);
		});

}; // end export function