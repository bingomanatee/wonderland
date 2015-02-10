wonderlandApp.controller('StoriesCtl',
  function ($scope, $resource, uiGridConstants, Stories, Accounts) {

    function _loadStories() {
      $scope.stories = Stories.query(function (data) {
        console.log("got stories: ", data);
      });
    }

    _loadStories();

    Stories.watch(_loadStories, '*', '*');

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

    $scope.launchStoryBound = $scope.launchStory.bind($scope);

    $scope.storyDate = function (story) {
      var str = story.createdBy;
      var d = Date.parse(str);
      return d.valueOf();
    };

    $scope.$watch('mySelections', function (items) {
      console.log("selection", items);
    }, true);

  })
  .directive('wlStory', function () {
    return {
      templateUrl: 'wonderland/templates/wl-story.html',
      transclude: true
    }
  });
