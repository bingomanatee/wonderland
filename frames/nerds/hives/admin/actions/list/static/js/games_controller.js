(function () {


    function GamesAdminController($scope, $filter, $compile, $modal, Games, $window) {

        $scope.games = Games.query();

        $scope.go = function(row){
            console.log('row clicked: ', row);
            document.location = '/admin/nerds/game/' + row.entity._id;
        };

        $scope.genres =  ["historical", "fantasy", "modern", "near future/cyberpunk", "superhero", "action/cinematic", "horror",
            "sci fi"];

        $scope.gameGridOptions = {
            data: 'games',
            showFilter: true,
            showGroupPanel: true,
            selectedItems: $scope.active_tweet,
            multiSelect: false,
            columnDefs: [
                {name: 'go', title: '&nbsp;', cellTemplate:
                    '<button id="editBtn" type="button" class="btn btn-primary" ng-click="open(row)" >Edit</button> ',
                    width: '*'
                },
                {field: 'name', displayName: 'Name', width: '***'},
                {field: 'genre', displayName: 'Genre', width: '*'},
                {field: 'description', displayName: 'Descripiton', width: '****'}
            ]

        };


        $scope.open = function (row) {
            console.log('opening row ', row);
            $scope.game = row.entity;

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html'    ,
          controller: ModalGameEditCtrl  ,
                resolve: {
                    game: function () {
                        return $scope.game;
                    }
                }
            });

            modalInstance.result.then(function (game) {
                if (game){
                    $scope.game = game;
                    console.log('putting ', game);
                    Games.update(game);
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

    }

    GamesAdminController.$inject = ['$scope', '$filter', '$compile', '$modal', 'Games', '$window'];

    angular.module('NERDS_app').controller('GamesAdminController', GamesAdminController);

    function ModalGameEditCtrl($scope, $modalInstance, game){

        $scope.genres =  ["historical", "fantasy", "modern", "near future/cyberpunk", "superhero", "action/cinematic", "horror",
            "sci fi"];

        $scope.ok = function(){$modalInstance.close($scope.game); };
        $scope.cancel = _.bind( $modalInstance.dismiss, $modalInstance);

        $scope.game = game;
    }

    angular.module('NERDS_app').controller('ModalGameEditCtrl', ModalGameEditCtrl);

})();