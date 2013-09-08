(function () {

    function _random_color() {
        var b = Math.floor((Math.random() + Math.random()) * 128);
        return 'rgb(' + b + ',' + b + ',' + b + ')';
    }

    function _add_pip(stage, r, c, PIP_SIZE) {
        var pip = new createjs.Shape();
        pip.graphics.beginFill(_random_color()).drawRect(0, 0, PIP_SIZE, PIP_SIZE);
        pip.x = r * PIP_SIZE;
        pip.y = c * PIP_SIZE;
        stage.addChild(pip);
        return pip;
    }

    // ----------------------- root controller ---------------------------

    function GameCreationCtrl($scope, $filter, $compile, $modal, Games, $window) {

        // ----------------------- modal for editing tile ---------------------------

        function ModalTileEditor($scope, $modalInstance) {
            $scope.types = [
                'city', 'town', 'village', 'forest', 'hills', 'mountains', 'desert', 'ocean', 'lake', 'river', 'swamp', 'building', 'room', 'hall', 'cave'
            ];
        }

        angular.module('NERDS_app').controller('ModalTileEditor', ModalTileEditor);

        $scope.games = Games.query();
        $scope.game = Games.get({_id: $window.game_id});

        var scope_ele = $('#game_creation');
        var create_canvas = scope_ele.find('#create_canvas')[0];


        var stage = new createjs.Stage(create_canvas);
        var PIP_SIZE = Math.floor(create_canvas.width / 5);
        var pips = [];
        for (var r = 0; r < create_canvas.width / PIP_SIZE; ++r) {
            for (var c = 0; c < create_canvas.height / PIP_SIZE; ++c) {
                var pip = _add_pip(stage, r, c, PIP_SIZE);
                pip.r = r;
                pip.c = c;
                (function (pip) {

                    pip.addEventListener('mousedown', function (evt) {
                        console.log('clicked on pip ', pip.r, pip.c);
                        $scope.pip = pip;
                        $scope.edit_tile(pip);
                    });
                })(pip);
                pips.push(pip);
            }
        }
        stage.update();

        $scope.create = function (type) {
        };

        $scope.edit_tile = function (pip) {
            console.log('opening pip ', pip);
            $scope.pip = pip;

            var modalInstance = $modal.open({
                templateUrl: 'modalTileEditor.html',
                controller: ModalTileEditor
            });

            modalInstance.result.then(function () {
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


    }

    GameCreationCtrl.$inject = ['$scope', '$filter', '$compile', '$modal', 'Games', '$window'];

    angular.module('NERDS_app').controller('GameCreationCtrl', GameCreationCtrl);

})();