(function (window) {

    var app = angular.module('NERDS_app');

    app.factory('init_map_canvas', function () {

        return function ($scope, canvas) {

            $scope.canvas = canvas;

            $scope.stage = new createjs.Stage($scope.canvas);

            $scope.map_container = new createjs.Container();
            $scope.stage.addChild($scope.map_container);

            $scope.hex_grid = new createjs.Container();
            $scope.city_container = new createjs.Container();
            var cities = new createjs.Container();
            cities.name = 'cities';
            var city_labels = new createjs.Container();
            city_labels.name = 'labels';
            $scope.city_container.addChild(cities);
            $scope.city_container.addChild(city_labels);

            $scope.road_container = new createjs.Container();
            $scope.new_road_container = new createjs.Container();

            $scope.map_container.addChild($scope.hex_grid);
            $scope.map_container.addChild($scope.road_container);
            $scope.map_container.addChild($scope.new_road_container);
            $scope.map_container.addChild($scope.city_container);

            $scope.toolbar = new createjs.Container();
            $scope.stage.addChild($scope.toolbar);
        };

    });

})(window);