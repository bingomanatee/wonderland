console.log('controller loaded');

(function () {

	var _DEBUG = true;

	var homeApp = angular.module('home', ['articleservices', 'ngGrid']);

	angular.module('articleservices', ['ngResource']).factory('Articles',
		function ($resource) {
			return $resource('/blog_rest/articles/:name', { name: '@name'}, {
				//	get:{method:'GET'},
				query: {method: 'GET', url: '/blog_rest/articles', isArray: true}//,
				//	add:{method:'POST' },
				//	update:{method:'PUT' },
				//	delete:{method:'DELETE'}
			});
		});

	function ArticleController($scope, $filter, $compile, Articles) {


		$scope._apply = function (f) {
			try {
				if (!$scope.$$phase) {
					$scope.$apply(f);
				} else {
					if (f) {
						f();
					}
				}
			} catch (e) {
				throw e
			}
		};

		$scope.$watch('articles', set_grid_articles, true);
		$scope.$watch('folder_filter', set_grid_articles);
		$scope.$watch('tag_filter', set_grid_articles);
		$scope.articles = Articles.query();

		$scope.grid_articles = [];

		function set_grid_articles(){
			var filtered_articles  = $scope.get_articles();

			if (filtered_articles.length < $scope.articles.length){
				console.log('subset: ', filtered_articles);
			}

			$scope.grid_articles = _.map(filtered_articles, function(article){
				article = _.clone(article);
				if (article.revised){
					article.revised = moment(article.revised, 'YYYY-MM-DD HH:mm').format('MMM DD, YYYY')
				}
				return article;
			});
		}

		$scope.tags = function () {
			var out = _.sortBy(_.uniq(_.compact(_.flatten(_.pluck($scope.articles, 'tags')))), _.identity);
			console.log('tags:', out);
			return out;
		};

		$scope.folders = function () {
			var out = _.sortBy(_.uniq(_.compact(_.pluck($scope.articles, 'folder'))), _.identity);
			console.log('folders:', out);
			return out;
		};

		$scope.view = 'cards';

		$scope.clear_filters = function(){
			$scope.clear_tag_filter();
			$scope.clear_folder_filter();
		}

		$scope.clear_tag_filter = function () {
			$scope.tag_filter = '';
		};

		var _folder_path = _.template('/blog/<%= folder %>/<%= file_name %>');
		var _file_path = _.template('/blog/<%= file_name %>');

		$scope.go_article = function(_id){
			var article = _.find($scope.articles, function(a){
				return a._id = _id;
			})
			if (article) {
				$scope.go(article);
			}
		};

		$scope.go = function(article){
			if (article.folder){
				document.location = _folder_path(article);
			} else {
				document.location = _file_path(article);
			}
		};

		$scope.set_tag_filter = function (tag) {
			$scope.tag_filter = tag;
		};

		$scope.clear_folder_filter = function () {
			$scope.folder_filter = '';
		};

		$scope.set_folder_filter = function (folder) {
			$scope.folder_filter = folder;
		};

		$scope.get_articles = function () {
			try {
				return _.filter($scope.articles, function (article) {
				if ($scope.tag_filter && article.tags && _.isArray(article.tags) && (!_.contains(article.tags, $scope.tag_filter))) {
					return false;
				}

				if ($scope.folder_filter && ( article.folder != $scope.folder_filter)) {
					return false;
				}

				return true;
			})
		} catch(e){
				console.log('ga error: %s', e);
				return [];
			}
		};

		$scope.nav_class = function (item) {
			if (item == $scope.view) {
				return 'active';
			} else {
				return '';
			}
		};

		if (_DEBUG) setInterval(function () {
			console.log('scope: ', $scope);
		}, 5000);

		$scope.gridOptions = {
			data:           'grid_articles',
			showGroupPanel: true,
			showFilter:     true,
			columnDefs:     [
				{field: 'title', displayName: 'Title', width: '*****', groupable: false,
					cellTemplate: '<div><div class="ngCellText">' +
						              '<a ng-click="go(row.entity)">{{ row.getProperty(col.field) }}</a>' +
						'</div></div>'

				},
				{field: 'folder', displayName: 'Folder', width: "**"},
				{field: 'intro', displayName: ' ', width: '*********', groupable: false},
				{field: 'revised', displayName: 'Revised', width: '***', cellFilter: "date:'MMM dd, yyyy'",
				sortFn: function(a, b){
					a = moment(a, 'MMM DD, YYYY').unix();
					b = moment(b, 'MMM DD, YYYY').unix();
					if (a < b){
						return -1;
					} else if (a > b){
						return 1;
					} else {
						return 0;
					}
				}

				},
			/*	{field:           'tags', displayName: 'Tags', width: '***', groupable: false,
					cellTemplate: '<div>' +
					                  '<div class="ngCellText" ng-class="col.colIndex()" ' +
					                  'title="{{row.getProperty(col.field).join(\', \') }}">' +
					                  '{{row.getProperty(col.field).slice(0, 2).join(\', \') }}' +
						'</div></div>'

				}, */
				{field:           '_id', displayName: ' ', width: '**', groupable: false,
					cellTemplate: '<div><div class="ngCellText" style="padding: 0px">' +
						'<button class="btn btn-xsmall"' +
						' ng-click="go(row.entity)">Go</button>' +
						'</div></div>'
				}

			]

		};

		$scope.set_nav_mode = function (mode) {
			console.log('setting nav mode:', mode);
			$scope.view = mode;
		}

		window.ngGrid.i18n['en'].ngGroupPanelDescription = 'Drag columns here to group'
	}

	ArticleController.$inject = ['$scope', '$filter', '$compile', 'Articles'];

	homeApp.controller('ArticleCtrl', ArticleController);
})();

