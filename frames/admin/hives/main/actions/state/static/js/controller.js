(function () {

	var homeApp = angular.module('state', ['routeService', 'ngGrid']);

	angular.module('routeService', ['ngResource']).factory('Routes',
		function ($resource) {
			return $resource('/admin/state/routes', {}, {
				get:    {method: 'GET'},
				query:  {method: 'GET', isArray: true}
			});
		}).factory('StaticPaths',
		function ($resource) {
			return $resource('/admin/state/staticpaths', {}, {
				get:    {method: 'GET'},
				query:  {method: 'GET', isArray: true}
			});
		}).factory('Models',
        function ($resource) {
            return $resource('/admin/state/models', {}, {
                query:  {method: 'GET', isArray: true}
            });
        }).factory('StaticContent',
        function ($resource) {
            return $resource('/admin/state/staticcontent/:prefix', {}, {
                query:  {method: 'GET', isArray: true}
            });
        });

	function StateController($scope, $filter, $compile, Routes, StaticPaths, StaticContent, Models) {

		$scope.routes = Routes.query();
		$scope.staticpaths = StaticPaths.query();
		$scope.models = Models.query();

		$scope.gridOptions = {
			data:           'routes',
			showGroupPanel: true,
			showFilter:     true,
			columnDefs:     [
				{field: 'action', displayName: 'Action', width: "**"},
				{field: 'method', displayName: 'Method', width: "*"},
				{field: 'path', displayName: 'Route', width: "***", groupable: false}
				// more fields here
			]

		};

        $scope.static_path = [];

        $scope.$watch('static_path[0]', function(path){
            $scope.static_files = StaticContent.query(path);
        })

		$scope.staticGridOptions = {
			data:           'staticpaths',
            selectedItems: $scope.static_path,
            multiSelect: false,
			showFilter:     true,
			columnDefs:     [
				{field: 'alias', displayName: 'alias', width: "**"},
				{field: 'prefix', displayName: 'Method', width: "***"}
			]

		};
		$scope.modelGridOptions = {
			data:           'models',
			showFilter:     true,
			columnDefs:     [
				{field: 'name', displayName: 'Name', width: "**"}
			]

		};

	}

	StateController.$inject = ['$scope', '$filter', '$compile', 'Routes', 'StaticPaths', 'StaticContent', 'Models'];

	homeApp.controller('StateController', StateController);
})();

