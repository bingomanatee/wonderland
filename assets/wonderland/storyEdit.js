wonderlandApp.controller('StoryEditCtrl', ['$scope',  '$window', '$modal', '$resource',
  'uiGridConstants',  'Stories', 'StoryPages', 'StoryJumps', 'filterCode',
  function ($scope, $window, $modal,  $resource,
    uiGridConstants, Stories, StoryPages, StoryJumps, filterCode) {

    function _loadPages() {
      if ($scope.id)  $scope.pages = StoryPages.forStory({id: $scope.id});
    }

    function _loadStory(){
      if ($scope.id)   $scope.story = Stories.get({id: $scope.id});
    }

    function _sendPage() {
      var data = $scope.newPage;
      data.story = $scope.id;
      StoryPages.save(data, function(result){
        var saves = $scope.jumps.length;
        var sent = false;
        var savedJumps = [];
        function _onSave(data){
          savedJumps.push(data);
          if (sent) return;
          if (--saves == 0 ){
           {
             $scope.alerts.push({type: 'success', msg: 'All Jumps Saved'});
             sent = true;
             StoryJumps.observer.broadcast(savedJumps, 'new');
           }
         }
       }

       if (result.id){
        console.log('story page saved; saving jumps', result);
        angular.forEach($scope.jumps, function(jump){
          jump.story = result.id;
          StoryJumps.save(jump, _onSave);
        });
        $scope.jumps = [];
        $scope.newPage = {title: '', body: '', story: result.id};
        $scope.alerts.push({type: 'success', msg: 'Saved story page'});
      } else {
        $scope.alerts.push({type: 'danger', msg: 'Failed to save story page'});
      }
    });

    }

    $scope.jumps = [];
    $scope.state = {showFullPage: false};
    $scope.isCollapsed = true;
    $scope.newPage = {title: '', body: ''};
    $scope.id = 0;

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

    $scope.validateSubmitHit = function(){
      console.log('validate submit hit');
    }

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
      $scope.id = id;
      _loadStory();
      _loadPages();
    };


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
      return $scope.state.showFullPage;
    };

    // ----------- Code/ custom code management

   // $scope.customCode = false; // whether the user is customizing the code, in which case the code is not updated by reflecting title
    $scope.codeSuggestion = ''; // an alternative to the current code
    $scope.codeIsUnique = true;

    $scope.userCodeChange = function(value){
      console.log('user code change: ', value);
      $scope.newPage.customCode = true;
    }

    $scope.showCodeSuggestion = function(){
      if (!$scope.newPage.code) return false;
      return !$scope.codeIsUnique;
    };

    function _codeCheck(result){
      $scope.codeIsUnique = (result.code == $scope.newPage.code);
      $scope.codeSuggestion = result.hasOwnProperty('code') ? result.code : '';
    }

    $scope.$watch('newPage.title', function (title) {
      if (title && !$scope.newPage.customCode){
        $scope.newPage.code = filterCode(title);
      }
    });

//@TODO: insulate against cascading changes
$scope.$watch('newPage.code', function(code){
  if (code){
    StoryPages.uniqueCode({story: $scope.id, code: code}, _codeCheck);
  }
});

$scope.$watch('newPage.customCode', function(cc){
       // console.log('customCode updated to ', cc);
       if (!cc){
        $scope.newPage.code = filterCode($scope.newPage.title);
      }
    });

$scope.useUniqueCode = function(){
  $scope.newPage.code = $scope.codeSuggestion;
  $scope.newPage.customCode = true;
}

    // ---------- footer errors

    $scope.newPageErrors = function (){
      var errors = [];
      if (!($scope.newPage.title && $scope.newPage.title.length > 7)){
        errors.push('Your new page needs a title at least 8 characters long');
      }
      if (!($scope.newPage.body && $scope.newPage.body.length> 20)){
        errors.push('Your new page needs a body at least 20 characters long');
      }

      if (!($scope.newPage.code)){
        errors.push('Your new page needs a code');
      } else if (!($scope.codeIsUnique)){
        errors.push('Your new page code must be unique within the scope of the story');
      }

      return errors;
    };

    $scope.newPageHasErrors = function(){
      return $scope.newPageErrors().length;
    };

    $scope.newPageStatusMessage = function(){
      var err = _newPageErrors();
      var text = '';
      if (err.length){
        text = _unmetReqTemplates({errors: err});
      } else if ($scope.jumps.length == 0){
        text =  '<div class="alert alert-info">You can save this page; however there are no exit jumps from the page</div>'
      } else text = '<div class="info">Your page is ready to save</div>';

      return text;
    };


    $scope.$watch('newPage.body', function (b) {
      try {
        $scope.newPage.body_marked = marked(b);
      } catch (err) {
        console.log('problem marking up ', b, ': ', $scope.newPage.body_marked);
      }
    });

// -------------- Dynamic style for full page version

function _mainStyle() {
  var out = {height: $window.innerHeight - 120};
   //   console.log('setting main style to ', out);
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
