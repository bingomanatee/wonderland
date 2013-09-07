(function () {

    function SkillsController($scope, $filter, $compile, Skills, $window) {

        $scope.skills = Skills.query(function(response){
            $scope.flat_skills = _.reduce(response, function (out, skill) {
                _.each(skill.school, function (school) {
                    if (/\w/.test(school)){
                        out.push(_.defaults({school: school, requires: skill.requires.length ?  skill.requires[0] : ''}, skill));
                    }
                });
                return out;
            }, []);
        });

        $scope.go = function (row) {
            console.log('row clicked: ', row);
            document.location = '/nerds/skill/' + row.entity._id;
        };

        $scope.skillsGridOptions = {
            data: 'flat_skills',
            showFilter: true,
            showGroupPanel: true,
            multiSelect: false,
            columnDefs: [
                {field: 'name', displayName: 'Name', width: '**'},
                {field: 'base', displayName: 'Basis', width: '*'},
                {field: 'school', displayName: 'School', width: '**'},
                {field: 'requires', displayName: 'Req.', width: '*'},
                //   cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text><span ng-repeat="s in row.entity.school">{{  s }} </span></span></div>'},
                {field: 'description', displayName: 'Description', width: '******'


                }
            ]

        };

    }

    SkillsController.$inject = ['$scope', '$filter', '$compile', 'Skills', '$window'];

    angular.module('NERDS_app').controller('SkillsController', SkillsController);

})();