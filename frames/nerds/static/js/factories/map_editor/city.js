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
                    { field: "name", displayName: 'City', width: '***' },
                    { field: "size", displayName: 'Size', width: "*" },
                    {field: 'type', displayName: 'Type', width: '*'}
                ]

            };

            $scope.hex_event_city = function (hex) {

                function CreateCityCtrl($scope, $modalInstance, game_name, hex) {

                    $scope.game_name = game_name;

                    $scope.sizes = [
                        {
                            label: 'crossroads(up to 20)',
                            value: 20
                        },
                        {
                            label: 'hamlet(up to 100)',
                            value: 100
                        },
                        {
                            label: 'village(up to 1000)',
                            value: 1000
                        },
                        {
                            label: 'town(up to 10,000)',
                            value: 10000
                        },
                        {
                            label: 'small city(up to 100,000)',
                            value: 100000
                        },
                        {
                            label: 'city(up to 500,000)',
                            value: 500000
                        },
                        {
                            label: 'large city(up to 1,000,000)',
                            value: 1000000
                        },
                        {
                            label: 'metropolis(up to 5,000,000)',
                            value: 5000000
                        },
                        {
                            label: 'sprawl(c. 10,000,000)',
                            value: 10000000
                        }

                    ]

                    $scope.types = [
                        'settlement',
                        'fort',
                        'ghost town/ruins',
                        'caverns',
                        'camp',
                        'company town'
                    ]

                    $scope.save = function () {
                        $modalInstance.close($scope.new_city);
                    };
                    $scope.cancel = _.bind($modalInstance.dismiss, $modalInstance);
                }

                $scope.new_city = {name: '', description: '', size: 100000, type: 'settlement'};

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