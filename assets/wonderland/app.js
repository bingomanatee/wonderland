var wonderlandApp = angular.module('WonderlandApp',
  ['ngResource', 'ngSanitize', 'ui.grid', 'ui.grid.selection', 'ui.bootstrap'])
  .factory('Stories', ['$resource', function ($resource) {

    function StoryObserver(stories) {
      this.stories = stories;
      this.watchers = [];
    }

    function _normalizeIds(ids) {
      if (!ids) {
        ids = ['*'];
      } else if (typeof ids == 'number' || typeof ids == 'string') {
        ids = [ids];
      }
      return ids;
    }

    function _normalizeMethods(methods) {
      if (!methods) {
        methods = [];
      }
      if (typeof methods == 'string') {
        methods = [methods];
      }
      return methods;
    }

    function ObserverData(callback, ids, methods) {
      this.callback = callback;
      this.ids = _normalizeIds(ids);
      this.methods = _normalizeMethods(methods);
    }

    ObserverData.prototype.match = function (ids, method) {
      ids = _normalizeIds(ids);
      if (this.methods.length) {
        var goodMethod = false;
        for (var m = 0; m < this.methods.length; ++m) {
          if (method == this.methods[m]) {
            goodMethod = true;
            break;
          }
        }
        if (!goodMethod) {
          return false;
        }
      }

      if (this.ids.length && ids.length) {
        var goodId = false;

        for (var i = 0; i < ids.length; ++i) {
          if (goodId) {
            break;
          }
          for (var j = 0; j < this.ids.length; ++j) {
            if (ids[i] == this.ids[j]) {
              goodId = true;
              break;
            }
          }
        }

        if (!goodId) {
          return false;
        }
      }
      return true;
    };

    StoryObserver.prototype.watch = function (callback, ids, methods) {

      var observerData = new ObserverData(callback, ids, methods);

      this.watchers.push(observerData);
      return observerData;
    };

    function _ids(records){
      var out = [];
      for (var i = 0; i < records.length; ++i){
        out.push(records[i].id);
      }
      return out;
    }

    StoryObserver.prototype.broadcast = function (records, method) {
      if (method && typeof method == 'string') {
        for (var i = 0; i < this.watchers.length; ++i) {
          var watcher = this.watchers[i];
          if (watcher.match(_ids(records), method)) {
            watcher.callback.call(this.stories, reords);
          }
        }
      }
    };

    var Stories = $resource('/stories/:id', {id: '@id'}, {});
    Stories.observer = new StoryObserver(Stories);

    return Stories;
  }
  ])
  .
  factory('Accounts', ['$resource', function ($resource) {
    var Accounts = $resource('/accounts/:username', {id: '@id'}, {
      account: {url: '/account', method: 'GET'}
    });

    return Accounts;
  }]);

console.log('wonderlandLapp loaded');
