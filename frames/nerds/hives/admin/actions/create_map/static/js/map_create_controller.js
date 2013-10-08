(function () {

    var app = angular.module('NERDS_app');

    // ----------------------- root controller ---------------------------

    function MapCreateCtrl($scope, $modal, Games, game_info, $window) {

        var GAME_ID = $window.game_id;

        console.log('game id:', GAME_ID);
        function CreateTerrainCtrl($scope, $modalInstance, game_name) {

            $scope.red = 128;
            $scope.green = 128;
            $scope.blue = 128;

            _color_style = _.template('rgb(<%= red  %>,<%= green  %>,<%= blue  %>)');

            $scope.color_style = function () {
                return _color_style($scope);
            };

            $scope.$watch('red', function (red) {
                console.log('red: ', red);
            });

            $scope.$watch('color_style()', function (cs) {
                $('#terrain-color-swatch').css('background-color', cs).text(cs);

            });

            $scope.save = function () {
                $modalInstance.close({red: $scope.red, green: $scope.green, blue: $scope.blue, name: $scope.name, description: $scope.description});
            };
            $scope.cancel = _.bind($modalInstance.dismiss, $modalInstance);


            $scope.$watch('$$childTail', function (ct) {
                if (ct && (!ct.game_name)) {

                    ct.game_name = game_name;

                    _.each(['red', 'green', 'blue'], function (term) {
                        ct.$watch(term, function (value) {
                            $scope[term] = parseInt(value);
                        })
                    });
                    _.each([ 'name', 'description'], function (term) {
                        ct.$watch(term, function (value) {
                            $scope[term] = value;
                        })
                    });
                }
            })

        }


        $scope.create_terrain = function () {
            var modalInstance = $modal.open({
                templateUrl: 'createTerrain.html',
                controller: CreateTerrainCtrl,
                resolve: {
                    game_name: function () {
                        return $scope.game.name ? $scope.game.name : 'Untitled"'
                    }
                }
            });

            modalInstance.result.then(function (terrain) {
                if (terrain) {
                    console.log('new terrain:', terrain);
                }
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.game = Games.get({_id: GAME_ID});
        game_info($scope.game);

        $scope.create = function (type) {
        };

    }

    app.controller('MapCreateCtrl', MapCreateCtrl);

})();