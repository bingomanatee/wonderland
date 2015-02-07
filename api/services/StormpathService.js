var stormpath = require('stormpath');
var path = require('path');
var homedir = path.resolve(__dirname, '../../config/');
var app = null;

var stormpathService = {

  testMode: false,

  setTestMode: function (m) {
    stormpathService.testMode = !!m;
  },

  appName: function () {
    return stormpathService.testMode ? 'wonderlandTest' : 'wonderland';
  },

  getClient: function (callback) {
    var keyfile = path.resolve(homedir, 'apiKey-43N2FPJT68WEERGEL1H1PWDN0.properties');
    stormpath.loadApiKey(keyfile, function apiKeyFileLoaded(err, apiKey) {
      if (err) {
        callback(err);
      }
      var client = new stormpath.Client({apiKey: apiKey});
      callback(null, client);
    });
  },

  getApplication: function (callback) {
    if (app) {
     return callback(null, app);
    }
    stormpathService.getClient(function (err, client) {
      if (err) {
        return callback(err);
      }
      client.getApplications({name: stormpathService.appName()}, function (err, applications) {
        if (err) {
          return callback(err);
        }
        app = applications.items[0];
        return callback(null, app);

      });

    }); // end client retrieval
  },

  createAccount: function (account, callback) {
    stormpathService.getApplication(function (err, app) {
      if (err) {
        return callback(err);
      }

      app.createAccount(account, callback);
    })
  },

  authenticateAccount: function (username, password, callback) {
    stormpathService.getApplication(function (err, app) {
      if (err) {
        return callback(err);
      }

      app.authenticateAccount({username: username, password: password}, callback);
    });
  }

};

module.exports = stormpathService;
