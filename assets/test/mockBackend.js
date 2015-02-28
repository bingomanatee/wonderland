(function () {
  var myAppDev = angular.module('WonderlandAppE2E', ['WonderlandApp', 'ngMockE2E']);
  console.log('backend');
  myAppDev.run(function ($httpBackend) {
    var story = {
      id: 15,
      title: 'Test Story',
      description: 'test story description',
      createdUsername: 'testUserName'
    };

    var pages = {
      pages: [
        {
          id: 1,
          story: 15,
          title: 'Test Page 1',
          code: 'testpage1',
          jumps: []
        }, {
          id: 2,
          story: 15,
          title: 'Test Page 2',
          code: 'testpage2',
          jumps: []
        }]
    };

    function _nextJump(){
      console.log('getting nextJump');
      return 1 + _.reduce(pages.pages, function(next, page){
          console.log('finding next from page ', page, 'starting at ', next);
          debugger;
        return _.reduce(page.jumps, function(next, jump){
          console.log('updating next from jump ', jump, 'starting at ', next);
          return Math.max(jump.id, next);
        }, next);
      }, 0);
    }

    function _getPage(id){
      return _.find(pages.pages, {id: id});
    }

    var newPage = {
      id: 3,
      story: 15,
      title: 'New Test Page Title',
      body: 'New Test Page Body',
      code: 'newtestpagetitle'
    };

    var newPageData = _.clone(newPage);
    delete newPageData.id;
    var header = {'Content-Type': 'application/json'};

    console.log('updating backend');
    // returns the current list of phones
    $httpBackend.whenGET('/stories/15')
      .respond(story, {'Content-Type': 'application/json'});

    $httpBackend.when('GET', '/storypages/for_story/15')
      .respond(function () {
        console.log('getting ', pages.pages.length, ' story pages');
        return [200, pages, header];
      });

    $httpBackend.when('GET', new RegExp('^\/storypages\/code_for_story\/15\/.*'), header)
      .respond(function (m, url) {
        console.log('responding to code_for_story', url);
        var code = url.split('/').pop();
        var suggestion = code;
        _.forEach(pages.pages, function (page) {
          if (page.code == code) {
            suggestion = code + '_1'; // not robust
          }
        });

        var out = {
          code: suggestion
        };

        console.log('....returning code ', code);
        return [200, out, header];
      });

    $httpBackend.whenGET('/wonderland/templates/dialogs/newJump.html').passThrough();

    $httpBackend.when('POST', '/storypages')
      .respond(function (m, url, newPage) {
        try {
          newPage = JSON.parse(newPage);
        } catch (err) {
          console.log('cannot parse new page: ', newPage);
        }
        console.log('pushing new page ', newPage);
        var pageWithId = _.extend({id: 4, jumps: []}, newPage);
        pages.pages.push(pageWithId);
        return [200, pageWithId, header];
      });

    $httpBackend.when('POST', '/storyjumps')
      .respond(function (m, url, data, headers) {

        var jump = JSON.parse(data);
        var page = jump.fromPage ? _getPage(jump.fromPage) : false;
        if (!page){
          return [404, {error: 'cannot find page ' + jump.fromPage}, header]
        }
        jump.id = _nextJump();
        page.jumps.push(jump);

        return [200, jump, header];
      });

  });
})();
