var util = require('util');
/**
 * StormpathController
 *
 * @description :: Server-side logic for managing Stormpaths' accounts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * `StormpathController.login()`
   * a json service that returns an error message or an account as a response to a login attempt.
   */
  signin: function (req, res) {
    if (req.session.account) {
      return module.exports.signedIn(req, res);
    }

    var username = req.param('username');
    var password = req.param('password');

    if (!(username && password)) {
      return res.json({error: 'you must provide both a username and a password'});
    }

    StormpathService.authenticateAccount(username, password, function (err, account) {
      if (err) {
        util.log(util.format('error: %s', util.inspect(err)));
        return res.json({error: err.userMessage ? err.userMessage : err.toString()});
      } else if (account.account) {
        req.session.account = account.account;
        FlashService.flashMessages(req)
          .addMessage('success', 'Welcome back to Wonderland, ' + account.account.username);
        return res.json(account);
      } else {
        return res.json({error: 'cannot find account data'});
      }
    });
  },

  signedIn: function (req, res) {
    if (!req.session.account) {
      FlashService.flashMessages(req)
        .addMessage('danger', 'You are not signed in');
      return module.exports.signin(req, res);
    } else {
      return res.json({error: 'attempt to re-sign in'});
    }
  },

  /**
   * `StormpathController.signOut()`
   * an HREF that clears the account from the service.
   */
  signOut: function (req, res) {
    req.session.account = false;
    FlashService.flashMessages(req)
      .addMessage('success', "Thanks for visiting! You have signed out of Wonderland");
    res.redirect('/');
  },

  /**
   * `StormpathController.member()`
   */
  account: function (req, res) {
    if (req.session.account)
    {
      var data = _.clone(req.session.account);
      delete data.email;
      return res.json({account: data});
    } else {
      return res.json({error: 'no account logged in'})
    }
  }
};

