(function () {


    function GameController($scope, $filter, $compile, Games, $window) {

        //   $scope.game = Game.query();

        $scope.twitter_id = $window.twitter_id;
        $scope.nerds_key = $window.nerds_key;
        $scope.twitter_display_name = $window.twitter_display_name;
        $scope.game_id = $window.nerds_game_id;

        $scope.game = Games.get({game_id: $scope.game_id});

    }

    GameController.$inject = ['$scope', '$filter', '$compile', 'Games', '$window'];

    angular.module('NERDS_app').controller('GameController', GameController);

})();