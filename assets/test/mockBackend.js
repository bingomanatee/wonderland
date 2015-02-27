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
    var headers = {'Content-T¬ype': 'application/json'};
    console.log('updating backend');
    // returns the current list of phones
    $httpBackend.whenGET('/stories/15').respond(story, headers);

    $httpBackend.whenGET('/storypages/for_story/15').respond(pages, headers);
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
