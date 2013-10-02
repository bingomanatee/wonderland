(function () {

    var app = angular.module('NERDS_app');

    // ----------------------- root controller ---------------------------

    function ThingCreateCtrl($scope, $filter, $compile, $modal, Things, $window) {

        $scope.things = Things.query({global: true});

        $scope.global = true;
        $scope.game = null;

        $scope.active_things = [];

        $scope.thingGridOptions = {
            data: 'things',
            showFilter: true,
            showGroupPanel: true,
            selectedItems: $scope.active_things,
            multiSelect: false,
            columnDefs: [
                {field: 'name', displayName: 'Name', width: '****'},
                {field: 'thing_type', displayName: 'Type', width: '**'},
                {field: 'anchor', displayName: 'A', width: '*'}
            ]
        };

        $scope.$watch('active_things', function (active) {
            if (!$scope.thing_canvas) return;
            if (active.length && active[0]) {
                $('.nav-tabs a[href="#thing_editor"]').tab('show')
            }
            $scope.thing_canvas.load(active[0]);
        }, true)
    }

    ThingCreateCtrl.$inject = ['$scope', '$filter', '$compile', '$modal',
        'Things', '$window'];


    app.controller('ThingCreateCtrl', ThingCreateCtrl);

})();