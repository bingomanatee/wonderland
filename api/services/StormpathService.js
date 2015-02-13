var stormpath = require('stormpath');
var path = require('path');
var homedir = path.resolve(__dirname, '../../config/');

var events = require('events');
var util = require('util');
var _ = require('lodash');
var client;

function StormpathServiceClass() {
  this.app = null;
  this.testMode = null;
}

util.inherits(StormpathServiceClass, events.EventEmitter);

_.extend(StormpathServiceClass.prototype,
  {

    testMode: false,

    setTestMode: function (m) {
      this.testMode = !!m;
    },

    clearApp: function () {
      this.app = null;
    },

    appName: function () {
      return this.testMode ? 'wonderlandTest' : 'wonderland';
    },

    getClient: function (callback) {
      if (client) {
        return callback(null, client);
      }
      var keyfile = path.resolve(homedir, 'apiKey-43N2FPJT68WEERGEL1H1PWDN0.properties');
      stormpath.loadApiKey(keyfile, function apiKeyFileLoaded(err, apiKey) {
        if (err) {
          callback(err);
        }
        client = new stormpath.Client({apiKey: apiKey});
        callback(null, client);
      });
    },

    clearAllAccounts: function (done) {
      if (!this.testMode) {
        throw new Error('cannot clear accounts for not test mode');
      }

      this._clearAccounts(done);
    },

    _clearAccounts: function (cb, currentCount) {
      var doneCount = 0;
      var self = this;
      this.getApplication(function (err, app) {
        app.getAccounts(function (err, result) {
          if (err) {
            cb(err);
          }
          var accounts = result.items;
          if (!_.isArray(accounts)) {
            return cb(new Error('non array items'));
          }
          delete result.items;
          //      util.log(util.format('accounts: %s', util.inspect(result)));
          //    util.log('deleting ' + accounts.length + ' records');
          if (accounts.length) {
            accounts.forEach(function (account) {
              if (account) {
                account.delete(function () {
                  //   util.log(util.format('deleting record %d of %d', ++doneCount, accounts.length));
                  if (++doneCount >= accounts.length) {
                    // cleared some records; all of them? lets make sure.
                    self._clearAccounts(cb, currentCount + doneCount);
                  }
                });
              } else {
                //     util.log('non-account in items');
                ++doneCount;
              }
            });
          } else {
            // app is empty
            cb(null, currentCount);
          }
        });
      });
    },

    getApplication: function (callback) {
      if (this.app) {
        return callback(null, this.app);
      }
      this.emit('init app');
      this.getClient(function (err, client) {
        if (err) {
          return callback(err);
        }
        client.getApplications({name: this.appName()}, function (err, applications) {
          if (err) {
            return callback(err);
          }
          this.app = applications.items[0];
          return callback(null, this.app);

        }.bind(this));

      }.bind(this)); // end client retrieval
    },

    createAccount: function (account, callback) {
      this.getApplication(function (err, app) {
        if (err) {
          return callback(err);
        }

        app.createAccount(account, callback);
      })
    },

    authenticateAccount: function (username, password, callback) {
      if (_.isObject(username)) {
        if (_.isFunction(password)) {
          callback = password;
        }
        password = username.password;
        username = username.username;
      }
      this.getApplication(function (err, app) {
        if (err) {
          return callback(err);
        }

        app.authenticateAccount({username: username, password: password}, callback);
      });
    }

  });

module.exports = new StormpathServiceClass;
