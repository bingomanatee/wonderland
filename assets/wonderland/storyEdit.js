wonderlandApp.controller('StoryEditCtrl', function ($scope, $resource, uiGridConstants, Stories, StoryPages) {

  function _loadPages() {
    $scope.pages = StoryPages.forStory({id: $scope.id});
  }

  function _sendPage() {
    StoryPages.save({story: $scope.id, title: $scope.title, body: $scope.body}, _loadPages);
  }

  $scope.isCollapsed = true;

  $scope.title = '';
  $scope.body = '';

  $scope.alerts = [];
  $scope.closeAlert = function (index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.sendPage = function () {
    _sendPage();
  };

  $scope.$watch('pages', function(value){
    console.log('vaue of pages: ', value);
  });

  $scope.init = function (id) {
    $scope.story = Stories.get({id: id});

    $scope.id = id;
    _loadPages();
  };

}); // end controller
