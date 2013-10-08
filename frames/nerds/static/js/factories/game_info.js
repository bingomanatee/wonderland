(function (window) {

    var app = angular.module('NERDS_app');

    /**
     * Draws the hexagon graphic buttons.
     */

    var game_info;

    app.factory('game_info', function () {

        return function(info){
            if (info){
                game_info = info;
            }

            return game_info;
        }
    });

})(window);