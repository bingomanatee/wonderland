var assert = require("assert");
var util = require('util');
var StormpathService = require('./../api/services/StormpathService');

describe('Stormpath', function () {
  beforeEach(function (done) {
    StormpathService.clearApp();
    StormpathService.setTestMode(true);
    util.log('clearing test account');
    StormpathService.clearAllAccounts(function (err, deleted) {
      if (err) {
        util.log(util.format('error during account clearing: %s', err));
      } else {
        util.log(util.format('deleted %d records.', deleted));
        done();
      }
    });
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

    it('should only get an application once', function (done) {
      StormpathService.clearApp();
      var appInits = 0;

      function appInitListener() {
        ++appInits;
      }

      StormpathService.on('init app', appInitListener);

      StormpathService.getApplication(function (err, app) {
        assert.equal(appInits, 1, 'getting application calls service');

        StormpathService.getApplication(function (err, app) {
          assert.equal(appInits, 1, 'getting application a second time doesn\t call service');

          StormpathService.removeAllListeners('init app');
          done();
        });
      });

    })
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

    describe('performance', function () {
      it('should create 30 records in a timely manner', function (done) {
        var count = 30;
        var insertionTimes = [];
        var insertions = 0;
        var accounts = [];
        var successes = 0;

        for (var i = 0; i < count; ++i) {
          (function (item) {
            var time = new Date();
            StormpathService.createAccount({
              givenName: item + ' of ' + count,
              surname: 'Borg',
              username: 'borg' + item + 'of' + count,
              email: 'borg' + item + '@cube.com',
              password: 'BorgUnit' + item
            }, function (err, newAccount) {
              var done = new Date();
              insertionTimes.push(done.getTime() - time.getTime());
              if (newAccount) {
                accounts.push(newAccount);
                ++successes;
              }
              if (++insertions == count) {
                completeSeries();
              }
            });
          })(i);
        }
        function completeSeries() {
          var max = Math.max.apply(Math, insertionTimes);
          var min = Math.min.apply(Math, insertionTimes);
          var avg = insertionTimes.reduce(function (sum, value) {
              return sum + value
            }, 0) / count;
          util.log(util.format('min time: %d, max time: %d, average time: %d, successes: ',
            min, max, avg, successes));
          var deletedCount = 0;
          accounts.forEach(function (account) {
            account.delete(function () {
              if (++deletedCount == accounts.length) {
                assert.equal(successes, count, 'all ' + count + ' records were created');
                assert.ok(max < 4000, 'worst time is under 4 seconds');
                assert.ok(avg < 3000, 'average time is under 3 seconds');

                done();
              }
            });
          });

        }
      }); // end record timely

    }); // end performance

  });

  describe('#authenticateAccount', function () {
    it('should authenticate a user', function (done) {
      var un = 'alphaWolf';
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

        StormpathService.authenticateAccount(un, pw, function (err, result) {
          //   util.log(util.format('result of auth: %s', util.format(result)));
          assert.equal(result.account.status, 'ENABLED', 'account should be enabled');
          newAccount.delete(done);
        });

      });
    });

    describe('performance', function () {
      it.only('should create 30 records in a timely manner', function (done) {
        var count = 30;
        var authTimes = [];
        var insertions = 0;
        var accounts = [];
        var successes = 0;
        var results = 0;
        var accountsData = [];
        var completing = false;

        for (var i = 0; i < count; ++i) {
          (function (item) {
            var time = new Date();
            var accountData = {
              givenName: item + ' of ' + count,
              surname: 'Stormtrooper',
              username: 'borg' + item + 'of' + count,
              email: 'borg' + item + '@cube.com',
              password: 'Stormtrooper' + item
            };
            accountsData.push(accountData);

            StormpathService.createAccount(accountData, function (err, newAccount) {
              var done = new Date();
              authTimes.push(done.getTime() - time.getTime());
              if (newAccount) {
                accounts.push(newAccount);
              }
              if (++insertions == count) {
                completeSeries();
              }
            });
          })(i);
        }
        function completeSeries() {
          if (completing){
            util.log('redundant attempt to complete');
            return;
          }
          completing = true;

          accountsData.forEach(function (account) {
            var startTime = new Date();
            StormpathService.authenticateAccount(account, function (err, result) {
              var endTime = new Date();

              authTimes.push(endTime.getTime() - startTime.getTime());
              if (!err) { //@TODO: inspect result
                ++successes;
              }
              if (++results >= accountsData.length) {
                report();
              }
            });

          });

        }

        var reporting = false;

        function report() {
          if (reporting){
            util.log('redundant report');
            return;
          }
          reporting = true;
          var max = Math.max.apply(Math, authTimes);
          var min = Math.min.apply(Math, authTimes);
          var avg = authTimes.reduce(function (sum, value) {
              return sum + value
            }, 0) / accountsData.length;
          util.log('times: ' + util.inspect(authTimes));
          util.log(util.format('min time: %d, max time: %d, average time: %d, successes: ',
            min, max, avg, successes));
          assert.equal(successes, count, 'all ' + count + ' records were authenticated');
          assert.ok(max < 5000, 'worst time is under 4 seconds');
          assert.ok(avg < 4000, 'average time is under 3 seconds');

          var deletedCount = 0;
          accounts.forEach(function (account, i) {
=            account.delete(function () {

              if (++deletedCount >= accounts.length) {
                done();
              }
            });

          });
        }
      }); // end record timely

    }); // end performance
  });

  describe('#authenticateAccount', function () {
    it('should not authenticate a user with a bad password', function (done) {
      var un = 'alphaWolf2';
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

        StormpathService.authenticateAccount(un, pw + 'foo', function (err, result) {
          //   util.log(util.format('result of auth: %s, %s', err, util.format(result)));
          assert.ok(err);
          newAccount.delete(done);
        });

      });
    });
  });

});
