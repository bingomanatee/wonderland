(function () {


    function GamesAdminController($scope, $filter, $compile, $modal, Games, $window) {

        $scope.games = Games.query();

        $scope.go = function (game) {
            document.location = '/admin/nerds/game/' + game._id;
        };
        $scope.create = function (game) {
            document.location = '/admin/nerds/create_game/' + game._id;
        };

        $scope.genres = ["historical", "fantasy", "modern", "near future/cyberpunk", "superhero", "action/cinematic", "horror",
            "sci fi"];

        $scope.gameGridOptions = {
            data: 'games',
            showFilter: true,
            showGroupPanel: true,
            multiSelect: false,
            columnDefs: [
                {name: 'go', title: '&nbsp;', cellTemplate: '<button id="editBtn" type="button" class="btn btn-primary" ng-click="open(row.entity)" >Edit</button> ',
                    width: '*'
                },
                {field: 'name', displayName: 'Name', width: '***'},
                {field: 'genre', displayName: 'Genre', width: '*'},
                {field: 'description', displayName: 'Descripiton', width: '****'},
                {name: 'create', title: '&nbsp;', cellTemplate: '<button id="editBtn" type="button" class="btn" ng-click="create(row.entity)" >Create</button> ',
                    width: '*'
                }
            ]

        };


        $scope.open = function (row) {
            console.log('opening row ', row);
            $scope.game = row.entity;

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalGameEditCtrl,
                resolve: {
                    game: function () {
                        return $scope.game;
                    }
                }
            });

            modalInstance.result.then(function (game) {
                if (game) {
                    $scope.game = game;
                    console.log('putting ', game);
                    Games.update(game);
                }
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

    }

    GamesAdminController.$inject = ['$scope', '$filter', '$compile', '$modal', 'Games', '$window'];

    angular.module('NERDS_app').controller('GamesAdminController', GamesAdminController);

    function ModalGameEditCtrl($scope, $modalInstance, game) {

        $scope.genres = ["historical", "fantasy", "modern", "near future/cyberpunk", "superhero", "action/cinematic", "horror",
            "sci fi"];

        $scope.ok = function () {
            $modalInstance.close($scope.game);
        };
        $scope.cancel = _.bind($modalInstance.dismiss, $modalInstance);

        $scope.game = game;
    }

    angular.module('NERDS_app').controller('ModalGameEditCtrl', ModalGameEditCtrl);

})();