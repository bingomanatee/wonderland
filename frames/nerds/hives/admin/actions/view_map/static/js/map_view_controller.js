(function () {

    var app = angular.module('NERDS_app');

    // ----------------------- root controller ---------------------------

    function MapViewCtrl($scope, $modal, Games, Maps, game_info, $window) {

        var MAP_ID = $window.map_id;

        console.log('map id:', MAP_ID);

        $scope.map = Maps.get({_id: MAP_ID});

        $scope.$watch('map', function(map){
            if (map && map.game){
                $scope.game = Games.get({_id: map.game});
            }
        }, true)

    }

    app.controller('MapViewCtrl', MapViewCtrl);

})();