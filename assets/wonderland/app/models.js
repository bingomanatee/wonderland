angular.module('WonderlandApp')
  .factory('popJsonArrayFactory', function () {

    return function _popJsonArray(key) {
      return function (data, headers) {
        var contentType = headers('Content-Type');
        if (/application\/json/.test(contentType)) {
          return (typeof data == 'object' ? data[key] : (angular.fromJson(data)[key])) || [];
        } else {
          return [];
        }
      }
    }

  })
  .factory('ObserverData', function () {

    function _ids(records) {
      var out = [];
      for (var i = 0; i < records.length; ++i) {
        out.push(records[i].id);
      }
      return out;
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

    ObserverData.prototype.toString = function () {
      return 'methods: ' + this.methods.join(',') + ', ids: ' + this.ids.join(',');
    };

    ObserverData.prototype.match = function (records, method) {
      console.log('looking for listener for method ', method);
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

      if (this.ids[0] == '*') {
        return true;
      }

      if (this.ids.length && ids.length) {
        var goodId = false;

        if (!goodId) {
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
        }
        return goodId;
      }
      return true;
    };

    return ObserverData;
  })
  .factory('ModelObserver', ['ObserverData', function (ObserverData) {

    function ModelObserver(model, name) {
      this.model = model;
      this.watchers = [];
      this.name = name;
    }

    ModelObserver.prototype.watch = function (callback, ids, methods) {
      var observerData = new ObserverData(callback, ids, methods);
      console.log('listening to ', observerData.toString(), ', for ', this.name);
      this.watchers.push(observerData);
      return observerData;
    };

    ModelObserver.prototype.broadcast = function (records, method) {
      console.log('broadcasting ', records, method, 'for ', this.name);
      if (method && typeof method == 'string') {
        for (var i = 0; i < this.watchers.length; ++i) {
          var watcher = this.watchers[i];
          if (watcher.match(records, method)) {
            watcher.callback.call(this.model, records);
          } else {
            console.log('broadcast message ', method, ' ignored by ', watcher.ToString());
          }
        }
      }
    };

    ModelObserver.prototype.clear = function (what) {
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

    return ModelObserver;
  }])
  .factory('Stories', ['$resource', 'ModelObserver', function ($resource, ModelObserver) {
    var model = $resource('/stories/:id', {id: '@id'}, {});
    model.observer = new ModelObserver(model, 'Stories');
    return model;
  }
  ])
  .factory('StoryJumps', ['$resource', 'ModelObserver', function ($resource, ModelObserver) {
    var StoryJumps = $resource('/storyjumps/:id', {id: '@id'});
    StoryJumps.observer = new ModelObserver(StoryJumps, 'StoryJumps');
    return StoryJumps;
  }])
  .factory('StoryPages', ['$resource', 'popJsonArrayFactory', 'ModelObserver', function ($resource, popJsonArrayFactory, ModelObserver) {
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
        transformResponse: popJsonArrayFactory('pages')
      }
    });
    Pages.observer = new ModelObserver(Pages, 'Pages');
    return Pages;
  }
  ]).factory('Accounts', ['$resource', function ($resource) {
    var Accounts = $resource('/accounts/:username', {id: '@id'}, {
      account: {url: '/account', method: 'GET'}
    });

    return Accounts;
  }])
  .factory('filterCode', function () {
    return function (title) {
      if (!title || (typeof title != 'string')) {
        return '';
      }
      return title.replace(/[^\w\d\-_]/gi, '').toLowerCase();
    }
  });
