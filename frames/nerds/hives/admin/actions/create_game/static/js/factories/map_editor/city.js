(function (window) {

    var app = angular.module('NERDS_app');

    /**
     * Draws the hexagon graphic buttons.
     */

    app.factory('map_editor_city', function ($modal) {

        return  function ($scope) {

            $scope.cities = [];
            $scope.city_grid_options = { data: 'cities',
                columnDefs: [
                    { field: "name", displayName: 'Road', width: '***' },
                    { field: "city_type", displayName: 'Type', width: "*" }]

            };

            $scope.hex_event_city = function (hex) {

                function CreateCityCtrl($scope, $modalInstance, game_name, hex) {

                    $scope.game_name = game_name;

                    $scope.save = function () {
                        $modalInstance.close($scope.new_city);
                    };
                    $scope.cancel = _.bind($modalInstance.dismiss, $modalInstance);
                }

                $scope.new_city = {name: '', description: ''};

                var modalInstance = $modal.open({
                        templateUrl: 'create_city.html',
                        controller: CreateCityCtrl,
                        scope: $scope,
                        resolve: {
                            hex: function () {
                                return hex;
                            },
                            game_name: function () {
                                return $scope.game.name ? $scope.game.name : 'Untitled"'
                            }
                        }
                    }
                );

                modalInstance.result.then(function (city) {
                    if (city) {
                        console.log('new city:', city);
                        $scope.cities.push(city);
                        hex.set_city(city);
                    }
                }, function () {
                    console.log('City Modal dismissed at: ' + new Date());
                });
            }

        };
    });

})(window);