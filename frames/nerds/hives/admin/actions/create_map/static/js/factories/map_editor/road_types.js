(function (window) {

    var app = angular.module('NERDS_app');

    var ROAD_TYPES = [
        'path',
        'cobblestone',
        'paved',
        'avenue',
        'highway',
        'freeway',
        'railroad',
        'subway'
    ];

    /**
     * Draws the hexagon graphic buttons.
     */

    app.factory('map_editor_road_types', function () {
            return ROAD_TYPES;
    });

})(window);