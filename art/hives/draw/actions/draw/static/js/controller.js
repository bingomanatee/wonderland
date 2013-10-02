(function () {

    function DrawingSaveEditor($scope, $modalInstance, drawing_metadata) {
        $scope.drawing_metadata = _.clone(drawing_metadata);

        $scope.save_drawing_dlog = function (preserve) {
            if (preserve) {

                $modalInstance.close($scope.drawing_metadata);
            } else {
                $modalInstance.dismiss();
            }
        }
    }

    function NoMemberWarningController($scope, $modalInstance) {
        $scope.warning_read = function () {
            $modalInstance.close();
        }
    }

    function PaintCtrl($scope, $filter, $compile, $window, $modal, Export_Drawing, Import_Drawing, drawings) {

        $scope.tab = 'drawing';
        $scope.$watch('current_color', function (color) {
            console.log('current color set to ', color);
            if (color) {
                $scope.set_current_color(color);
            }
        });

        $scope.member = $window.member;
        $scope.member_warning = false;

        if (!$scope.member) {

            var modalInstance = $modal.open({
                templateUrl: 'noMemberWarning.html',
                controller: NoMemberWarningController
            })

        }

        $scope.$watch('paint_manager', function (pm) {
            if (pm && $window.drawing_id) {
                $scope.drawing_id = $window.drawing_id;
                Import_Drawing($window.drawing_id, pm);
                drawings.get({_id: $window.drawing_id}, function (data) {
                    $scope.original_creator = data.creator;
                    $scope.drawing_metadata.name = data.name;
                    $scope.drawing_metadata.description = data.description;
                    $scope.drawing_metadata.public = data.public ? 1 : 0;
                });
            }
        });

        $scope.drawing_metadata = {name: '', description: '', public: 1};

        $scope.new_drawing = function () {
            //@TODO: clear paint_manager instead.
            document.location = '/art/draw?rand=' + Math.random();
        };

        $scope.delete_drawing = function(){

            if (!$scope.member) {
                return alert('You must be logged in to delete a drawing');
            }

            if (!$scope.original_creator == $scope.member._id){
                return alert('this is not your own drawing -- you cant delete it!')
            }

            drawings.remove({_id: $scope.drawing_id}, function(){
                document.location = '/art';
            });
        };

        $scope.save = function () {
            var modalInstance = $modal.open({
                templateUrl: 'drawingSaveDialog.html',
                controller: DrawingSaveEditor,
                resolve: {
                    drawing_metadata: function () {
                        return $scope.drawing_metadata;
                    }
                }
            });

            modalInstance.result.then(function (drawing_metadata) {
                if (!drawing_metadata && drawing_metadata.name) return;
                console.log('done with metadata', drawing_metadata);
                $scope.drawing_metadata = drawing_metadata;
                $scope.export(drawing_metadata);
            }, function () {
                console.log('dismissed');
            });

        };

        $scope.$watch('paint_manager.active_shape', function (as) {
            $scope.is_active = as;
            console.log('is_active', as);
        });

        setInterval(function () {

            var current = $scope.paint_manager.active_shape;
            if (current != $scope.active_shape) {
                $scope.$apply();
            }

        }, 500);

        $scope.export = function (meta) {
            if (!$scope.member) {
                return alert('You must be logged in to save a drawing');
            }


            var data = Export_Drawing($scope.paint_manager);
            _.extend(data, meta);
            data.creator = $scope.member._id;
            _.each(data.tokens, function (t) {
                t.shape_type = t.type;
                delete t.type;
            });

            if ($window.drawing_id) {
                if ($scope.original_creator != $scope.member._id) {
                    return alert('You can only save your own drawings -- no copying!');
                }
                data._id = $window.drawing_id;
                drawings.update(data, function (saved) {
                    console.log('saved ', data, 'as', saved);
                    document.location = "/art/draw/" + saved._id;
                });
            } else {
                drawings.add(data, function (saved) {
                    console.log('saved ', data, 'as', saved);
                    document.location = "/art/draw/" + saved._id;
                });
            }


        }
    }

    PaintCtrl.$inject = ['$scope', '$filter', '$compile', '$window', '$modal',
        'Export_Drawing', 'Import_Drawing', 'drawings'];

    angular.module('PaintApp').controller('PaintCtrl', PaintCtrl);


})(window);
