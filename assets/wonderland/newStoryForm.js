wonderlandApp.controller('NewStoryCtrl', function ($scope, $resource, uiGridConstants, Stories) {

  $scope.isCollapsed = true;

  $scope.title = '';

  $scope.description = '';

  $scope.alerts = [];
  $scope.closeAlert = function (index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.sendStory = function () {
    if ($scope.title && $scope.description) {
      Stories.save({title: $scope.title, description: $scope.description}, function (result) {
        var story = result.story;
        if (story) {
          console.log('story saved: ', story);
          $scope.alerts.push({type: 'success', msg: 'saved story ' + story.id + ": " + story.title});
          $scope.title = "";
          $scope.description = "";
          $scope.isCollapsed = false;
          Stories.observer.broadcast([story], 'created');
        } else if (result.error){
          $scope.alerts = [{type: 'danger', msg: result.error}];
        }
      });
    }
  }

});
