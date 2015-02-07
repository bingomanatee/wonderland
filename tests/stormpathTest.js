var assert = require("assert");
var util = require('util');
var StormpathService = require('./../api/services/StormpathService');

StormpathService.setTestMode(true);

describe('Stormpath', function () {
  before(function(done){
    StormpathService.getApplication(function(err, app){
      app.getAccounts(function(err, accounts){
        accounts.forEach(function(account){account.delete(); });
        done();
      });
    })
  });

  describe('#getClient', function () {
    it('should get a client', function (done) {
      StormpathService.getClient(function (err, client) {
        assert.equal(err, null, 'no error on client retrieval');
        assert.ok(client, 'client exists');
      //  util.log(util.format('client = %s', util.inspect(client)));
        done();
      })
    })
  });

  describe('#getApplication', function () {
    it('should get an application', function (done) {
      StormpathService.getApplication(function (err, app) {
        assert.equal(err, null, 'no error on app retrieval');
        assert.ok(app, 'app exists');
      //  util.log(util.format('app = %s', util.inspect(app)));
        done();
      });
    });
  });

  describe('#addAccount', function () {
    it('should add a user', function (done) {
      var account = {
        givenName: 'Jean-Luc',
        surname: 'Picard',
        username: 'jlpicard',
        email: 'jlpicard@starfleet.com',
        password: 'Changeme1!'
      };

      StormpathService.createAccount(account, function (err, newAccount) {
        assert.equal(err, null, 'no error on add account');
        assert.ok(newAccount, 'newAccount exists');
        assert.equal(newAccount.givenName, account.givenName, 'account has correct name');
        assert.equal(newAccount.email, account.email, 'account has correct email');
        assert.equal(newAccount.username, account.username, 'account has correct username');

        // util.log(util.format('newAccount = %s', util.inspect(newAccount)));
        newAccount.delete(function (err, result) {
          //  util.log(util.format('account deleted: %s, %s', err, result));
          done();
        })
      });
    });
  });

  describe('#authenticateAccount', function () {
    it('should authenticate a user', function (done) {
      var un =  'alphaWolf';
      var pw = 'myW0lfIsLong!';

      var account = {
        givenName: 'Alpha',
        surname: 'Wolf',
        username: un,
        email: 'alphaWolf@starfleet.com',
        password: pw
      };

      StormpathService.createAccount(account, function (err, newAccount) {

        //  util.log(util.format('result of wolf creation: %s, %s',
        //   util.inspect(err), util.inspect(newAccount)));
        assert.equal(err, null, 'no error on wolf creation');

        assert.ok(newAccount, 'wolf newAccount exists');

        StormpathService.authenticateAccount(un, pw, function(err, result){
       //   util.log(util.format('result of auth: %s', util.format(result)));
          assert.equal(result.account.status, 'ENABLED', 'account should be enabled');
          newAccount.delete(done);
        });

      });
    });
  });

  describe('#authenticateAccount', function () {
    it('should not authenticate a user with a bad password', function (done) {
      var un =  'alphaWolf2';
      var pw = 'myW0lfIsLong2!';

      var account = {
        givenName: 'Alpha2',
        surname: 'Wolf2',
        username: un,
        email: 'alphaWolf2@starfleet.com',
        password: pw
      };

      StormpathService.createAccount(account, function (err, newAccount) {

        //  util.log(util.format('result of wolf creation: %s, %s',
        //   util.inspect(err), util.inspect(newAccount)));
        assert.equal(err, null, 'no error on wolf creation');

        assert.ok(newAccount, 'wolf newAccount exists');

        StormpathService.authenticateAccount(un, pw+'foo', function(err, result){
       //   util.log(util.format('result of auth: %s, %s', err, util.format(result)));
          assert.ok(err);
          newAccount.delete(done);
        });

      });
    });
  });

});
