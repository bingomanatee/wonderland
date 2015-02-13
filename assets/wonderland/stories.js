wonderlandApp.controller('StoriesCtl',
  function ($scope, $resource, uiGridConstants, Stories, Accounts, $filter) {

    function _loadStories() {
      $scope.stories = Stories.query(function (data) {
        console.log("got stories: ", data);
      });
    }

    _loadStories();

    Stories.observer.watch(_loadStories);

    $scope.mySelections = [];

    $scope.storyGrid = {
      data: 'stories',
      enableFiltering: false,
      enableGridMenu: false,
      enableColumnMenus: false,
      selectionRowHeaderWidth: 0,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      noUnselect: true,
      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      columnDefs: [
        {
          name: 'title', width: 150, displayName: 'Story'
        },
        {
          name: 'description', displayName: 'Description'
        }
      ],
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (rows) {
          $scope.mySelections = gridApi.selection.getSelectedRows();
        });
      }
    };

    $scope.account = null;

    Accounts.account({}, function (result) {
      console.log('account: ', result);
      if (result.account) {
        $scope.account = result.account;
      }
    });

    $scope.isOwnedByCurrentUser = function (story) {
      if (!$scope.account) {
        return false;
      }
      return story.createdUsername == $scope.account.username;
    };

    $scope.isNotOwnedByCurrentUser = function (story) {
      return !$scope.isOwnedByCurrentUser(story);
    };

    $scope.launchStory = function (story) {
      console.log("click on ", story);
    };

    $scope.editStory = function(story) {
      document.location = '/stories/edit/' + story.id;
    };

    $scope.launchStoryBound = $scope.launchStory.bind($scope);

    $scope.storyDate = function (story) {
      var str = story.createdAt;
      return Date.parse(str) || new Date().getTime();
    };

    $scope.$watch('mySelections', function (items) {
      console.log("selection", items);
    }, true);

    $scope.publicStoryCount = function () {
      if (!$scope.stories) {
        return 0;
      } else if (!$scope.account) {
        return $scope.stories.length;
      } else {
        var c = 0;

        for (var i = 0; i < $scope.stories.length; ++i) {
          if ($scope.isNotOwnedByCurrentUser($scope.stories[i])) {
            ++c;
          }
        }
        return c;
      }
    };

    $scope.MAX_STORIES = 6;

    $scope.myStoryCount = function () {
      if (!$scope.stories) {
        return 0;
      } else if (!$scope.account) {
        return 0;
      } else {
        var c = 0;

        for (var i = 0; i < $scope.stories.length; ++i) {
          if ($scope.isOwnedByCurrentUser($scope.stories[i])) {
            ++c;
          }
        }
        return c;
      }
    }

  })
  .directive('wlStory', function () {
    return {
      templateUrl: 'wonderland/templates/wl-story.html',
      transclude: true
    }
  });
