wonderlandApp.controller('StoryEditCtrl', ['$scope', '$resource', 'uiGridConstants',
  'Stories', 'StoryPages', '$window', '$modal',
  function ($scope, $resource, uiGridConstants,
            Stories, StoryPages, $window, $modal) {

    function _loadPages() {
      $scope.pages = StoryPages.forStory({id: $scope.id});
    }

    function _sendPage() {
      var data = $scope.newPage;
      data.story = $scope.id;
      StoryPages.save(data, _loadPages);
      $scope.newPage = {title: '', body: '', story: id};
    }

    $scope.jumps = [];

    $scope.addJump = function () {
      var dlg = $modal.open({
        templateUrl: '/wonderland/templates/dialogs/newJump.html',
        controller: 'NewJumpCtrl',
        size: 'lg'
      }).result.then(function (newJump) {
          console.log('recieved newJump ', newJump);
          $scope.jumps.push(newJump);
        })
    };

    $scope.isCollapsed = true;

    $scope.newPage = {title: '', body: ''};

    $scope.alerts = [];
    $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.sendPage = function () {
      _sendPage();
    };

    $scope.$watch('pages', function (value) {
      console.log('vaue of pages: ', value);
    });

    $scope.init = function (id) {
      $scope.story = Stories.get({id: id});

      $scope.id = id;
      _loadPages();
    };

    $scope.state = {showFullPage: false};

    $scope.$watch('state.showFullPage', function (v) {
      console.log('sfp = ', v);
    });

    $scope.toggleSFP = function () {
      if (!$scope.state.hasOwnProperty('showFullPage')) {
        $scope.state.showFullPage = false;
      }
      $scope.state.showFullPage = !$scope.state.showFullPage;
    };

    $scope.isShowingFullPage = function () {
      console.log('getting sfp');
      return $scope.state.showFullPage;
    };

    $scope.$watch(
      'newPage.title', function (title) {
        $scope.newPage.code = title.replace(/[^\w\d\-_]/gi, '').toLowerCase();

        StoryPages.uniqueCode({story: $scope.id, code: $scope.newPage.code}, function (result) {
          console.log("unique code for ", $scope.newPage.code, result);
          $scope.newPage.clde = result.code;
        })
      }
    );

    $scope.$watch('newPage.body', function (b) {
      try {
        $scope.newPage.body_marked = marked(b);
      } catch (err) {
        console.log('problem marking up ', b, ': ', $scope.newPage.body_marked);
      }
    });

    function _mainStyle() {
      var out = {height: $window.innerHeight - 120};
      console.log('setting main style to ', out);
      return out;
    }

    $scope.mainStyle = _mainStyle();
    $scope.cellStyle = _mainStyle();
    function _resize() {
      $scope.mainStyle = _mainStyle();
      $scope.cellStyle = _.extend(_mainStyle(), {});
      $scope.$apply();
    }

    if ($window.attachEvent) {
      $window.attachEvent('onresize', _resize);
    }
    else if ($window.addEventListener) {
      $window.addEventListener('resize', _resize, true);
    }
    else {
      //The browser does not support Javascript event binding
    }

  }]) // end controller
  .controller('NewJumpCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

    $scope.ok = function () {
      console.log('sending newJump ', $scope.newJump);
      $modalInstance.close($scope.newJump);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.newJump = {prompt: '', toPageCode: ''};
  }]);
