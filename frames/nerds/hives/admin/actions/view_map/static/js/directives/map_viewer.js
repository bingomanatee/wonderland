(function () {

    var app = angular.module('NERDS_app');

    app.directive('mapViewer', function InjectingFunction($http, $modal, TerrainTypes, Maps, map_editor_draw_map, hex_size,
           easel_import, map_editor_road, map_editor_draw_hexes, map_editor_terrain, map_editor_city, game_info, init_map_canvas) {

        // === InjectingFunction === //
        // Logic is executed 0 or 1 times per app (depending on if directive is used).
        // Useful for bootstrap and global configuration

        return {
            templateUrl: '/templates/admin/nerds/map/map_viewer.html',

            scope: {
                map: "=map"
            },

            controller: function ($scope) {

              //  map_editor_draw_map($scope);
              //  map_editor_city($scope);
              //  map_editor_terrain($scope);
              //  map_editor_road($scope);

                _load_map = function (map) {
                    hexes = _.flatten(map.hexes);
                    map_editor_draw_hexes(hexes, $scope.hex_grid, $scope.city_container, $scope.map_container, $scope.canvas);

                };
/*
                $scope.$watch('map', function (map) {
                    console.log('directive got map ', map);
                    if (map && map.game && !$scope.map_drawn) {
                        $scope.map_drawn = true;
                        _load_map(map);
                    }
                }, true);*/

            },

            compile: function CompilingFunction($templateElement, $templateAttributes) {

                // === CompilingFunction === //
                // Logic is executed once (1) for every instance of ui-jq in your original UNRENDERED template.
                // Scope is UNAVAILABLE as the templates are only being cached.
                // You CAN examine the DOM and cache information about what variables
                //   or expressions will be used, but you cannot yet figure out their values.
                // Angular is caching the templates, now is a good time to inject new angular templates
                //   as children or future siblings to automatically run..

                return function LinkingFunction($scope, $linkElement, $linkAttributes) {

                    init_map_canvas($scope, $linkElement.find('canvas')[0]);


                };
            }
        };
    })

})
    (window);