(function (window) {

    /**
     * deprecated -- now in map editor
     * @type {*|module|test.module|details.module|.location.module|ctxt.module}
     */
    var app = angular.module('NERDS_app');

    app.directive('easel_map_editor', function InjectingFunction($http, hex_extent) {


        return function (scope, element, context) {
            console.log('making easel editor ele ', element, 'scope', scope, context);
            var canvas = $(element).find('canvas')[0];

            var stage = new createjs.Stage(canvas);

            var hex_grid = new createjs.Container();
            stage.addChild(hex_grid);

            var map_grid = [];
            var map_width = 0;

            function _change_terrain(terrain){
                console.log('terrain changed to', terrain);
            }

            scope.$watch('terrain', _change_terrain);

            function _change_map_width(width){
                console.log('width changed to ', width);
                $http({method: 'GET', map_size: width, hex_size: _hex_size(width)}).success(function(hexes){
                   _draw_hexes(hexes, stage, hex_grid);
                    stage.update();
                });
            }

            scope.$watch('map_width', _change_map_width);

        }
    });
})(window);