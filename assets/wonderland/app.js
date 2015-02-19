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
      console.log("new observer from ", ids, methods, ': ', this);
    }

    ObserverData.prototype.match = function (records, method) {
      var ids = _ids(records);
      if (this.methods.length && (method != '*')) {
        var goodMethod = false;
        for (var m = 0; m < this.methods.length; ++m) {
          if (method == this.methods[m]) {
            goodMethod = true;
            break;
          }
        }

        if (!goodMethod) {
          console.log('method ', method, 'does not match ', this.methods);
          return false;
        }
      }

      if (this.ids.length && ids.length) {
        var goodId = this.ids[0] == '*';

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

    function _ids(records) {
      var out = [];
      for (var i = 0; i < records.length; ++i) {
        out.push(records[i].id);
      }
      return out;
    }

    StoryObserver.prototype.broadcast = function (records, method) {
      if (method && typeof method == 'string') {
        for (var i = 0; i < this.watchers.length; ++i) {
          var watcher = this.watchers[i];
          if (watcher.match(records, method)) {
            watcher.callback.call(this.stories, records);
          }
        }
      }
    };

    StoryObserver.prototype.clear = function (what) {
      if (!what) {
        this.watchers = [];
      } else if (typeof what == 'function') {
        var a = [];
        for (var i = 0; i < this.watchers.length; ++i)
          if (this.watchers[i].callback !== what) {
            a.push(this.watchers[i]);
          }
        this.watchers = a;
      }
    };

    var Stories = $resource('/stories/:id', {id: '@id'}, {});
    Stories.observer = new StoryObserver(Stories);

    return Stories;
  }
  ])
  .factory('StoryJumps', ['$resource', function ($resource) {
    var StoryJumps = $resource('/storyjumps/:id', {id: '@id'});
    return StoryJumps;
  }]).factory('StoryPages', ['$resource', function ($resource) {
    var Pages = $resource('/storypages/:id', {id: '@id'}, {
      uniqueCode: {
        url: '/storypages/code_for_story/:story/:code',
        params: {story: '@story', code: '@code'},
        method: 'get'
      },
      forStory: {
        url: '/storypages/for_story/:id',
        params: {id: '@id'},
        isArray: true,
        transformResponse: function (data, headers) {
          console.log('data: ', data, ' headers: ', headers);
          if (/application\/json/.test(headers('Content-Type'))) {
            console.log('json header found:', headers('Content-type'));
            if (typeof data == 'object') {
              return data.pages;
            }
            return (angular.fromJson(data).pages) || [];
          } else {
            console.log('no json header found');
            return [];
          }
        }
      }
    });
    return Pages;
  }
  ])
  .factory('Accounts', ['$resource', function ($resource) {
    var Accounts = $resource('/accounts/:username', {id: '@id'}, {
      account: {url: '/account', method: 'GET'}
    });

    return Accounts;
  }]);

console.log('wonderlandLapp loaded');
