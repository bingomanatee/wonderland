(function () {

    function ArtCtrl($scope, $filter, $compile, $window, $modal, drawings) {

        $scope.drawings = drawings.query(function (drawings) {
            console.log("drawings found (", drawings.length, ')');

            $scope._unrendered_drawings = drawings.slice();
        });

        $scope.member = $window.member || false;

        $scope.new_drawing = function(){
            document.location = '/art/draw';
        }

    }

    ArtCtrl.$inject = ['$scope', '$filter', '$compile', '$window', '$modal', 'drawings'];

    angular.module('ArtApp').controller('ArtCtrl', ArtCtrl);


})(window);
