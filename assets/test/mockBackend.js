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
          code: 'testpage1'
        }, {
          id: 2,
          story: 15,
          title: 'Test Page 2',
          code: 'testpage2'
        }]
    };

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
        return [200, pages, {'Content-Type': 'application/json'}];
      });

    $httpBackend.when('GET', new RegExp('^\/storypages\/code_for_story\/15\/.*'), header)
      .respond(function (m, url) {
        // console.log('responding to code_for_story', url);
        var out = {
          code: 'testresultcode'
        };
        return [200, out, {'Content-Type': 'application/json'}];
      });

    $httpBackend.when('POST', '/storypages')
      .respond(function (m, url, newPage) {
        try {
          newPage = JSON.parse(newPage);
        } catch (err){
          console.log('cannot parse new page: ', newPage);
        }
        console.log('pushing new page ', newPage);
        var pageWithId = _.extend({id: 4}, newPage);
        pages.pages.push(pageWithId);
        return [200, pageWithId, {'Content-Type': 'application/json'}];
      });
    // adds a new phone to the phones array
    /*  $httpBackend.whenPOST('/phones').respond(function (method, url, data) {
     var phone = angular.fromJson(data);
     phones.push(phone);
     return [200, phone, {}];
     });
     $httpBackend.whenGET(/^\/templates\//).passThrough(); */
    //...
  });
})();
