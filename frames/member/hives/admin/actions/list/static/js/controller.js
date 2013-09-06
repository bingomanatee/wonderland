console.log('controller loaded');

(function () {

	var homeApp = angular.module('memberApp', ['memberService', 'ngGrid', 'ui.bootstrap']);

	angular.module('memberService', ['ngResource']).factory('memberModel',
		function ($resource) {
			return $resource('/admin/members/rest/members/:_id', { _id: '@_id'}, {
				get:    {method: 'GET'},
				query:  {method: 'GET', isArray: true},
				add:    {method: 'POST' },
				update: {method: 'PUT' },
				delete: {method: 'DELETE'}
			});
		}).factory('roleModel',
		function ($resource) {
			return $resource('/admin/members/rest/roles', {}, {
				query: {method: 'GET', isArray: true}
			});
		});

	function _primary_oauth(member) {
		var primary = _.find(member.oauthProfiles, function (profile) {
			return profile.primary;
		});

		return primary || _.first(member.oauthProfiles);
	}

	function memberController($scope, $filter, $compile, memberModel, roleModel) {

		$scope.membersCollection = memberModel.query();

		$scope.rolesCollection = roleModel.query();

		$scope.$watch('membersCollection', function (members) {

			if (_.isArray(members)) {
				var members = members.slice(0);
				$scope.members = _.map(members, function (member) {

					var oauth_primary = _primary_oauth(member);
					if (oauth_primary) {
						_.defaults(member, oauth_primary);
					}
					return member;
				});
			}

		}, true);

		$scope.members = [];

		$scope.addRoles = function (member) {
			console.log('row add roles', member);
			$scope.active_member = member;
			$scope.show_role_dialog = true;
		};

		function checkActiveMemberRoles() {
			if ($scope.active_member && $scope.rolesCollection) {
				_.each($scope.rolesCollection, function (role) {
					role.active = false;
				});

				if ($scope.active_member.roles) {
					_.each($scope.active_member.roles, function (role) {
						var matching_role = _.find($scope.rolesCollection, function (r) {
							return r._id == role;
						});
						if (matching_role) {
							matching_role.active = true;
						}
					})
				}
			}
		}

		$scope.$watch('active_member', checkActiveMemberRoles);
		$scope.$watch('rolesCollection', checkActiveMemberRoles);

		$scope.close_member_role_dialog = function () {
			$scope.show_role_dialog = false;
		};

		$scope.show_role_dialog = false;

		$scope.role_dialog_options = {
			backdropFade: true,
			dialogFade:   true
		};

		$scope.update_member_roles = function () {
			$scope.close_member_role_dialog();
			$scope.active_member.roles = _.pluck(_.filter($scope.rolesCollection, function(role){
				return role.active;
			}), '_id');
			console.log('saving member ', $scope.active_member);
			memberModel.update($scope.active_member);
		};

		$scope.gridOptions = {
			data:               'members',
			showGroupPanel:     true,
			showFilter:         true,
			enableRowSelection: false,
			columnDefs:         [
				{field: '_id', displayName: 'ID', width: "**", groupable: false},
				{field: 'displayName', displayName: 'Name', width: "***", groupable: false},
				{field: 'provider', displayName: 'Provider', width: '**', groupable: true},
				{field:           '_id', displayName: 'Set Roles', width: '*', groupable: false,
					cellTemplate: '<div><div class="ngCellText"><button class="btn btn-small" ng-click="addRoles(row.entity)">Add Roles</button></div></div>'
				}
				// more fields here
			]

		};
	}

	memberController.$inject = ['$scope', '$filter', '$compile', 'memberModel', 'roleModel'];

	homeApp.controller('memberController', memberController);
})();

