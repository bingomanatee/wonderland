(function () {

    var app = angular.module('NERDS_app');


    // ----------------------- modal for editing tile ---------------------------

    function ModalTileEditor($scope, $modalInstance, game, pip) {
        $scope.game = game;

        $scope.pip = pip;

        $scope.sizes = [
            {value: '0', label: 'Indefinite'},
            {value: '50', label: 'Spot (up to 50m)'},
            {value: '500', label: 'Tiny (500m)'},
            {value: '1000', label: 'Small (1km)'},
            {value: '5000', label: 'Fair (5km)'},
            {value: '20000', label: 'Medium (20km)'},
            {value: '50000', label: 'Large (50km)'},
            {value: '100000', label: 'Great (100km)'},
            {value: '500000', label: 'Huge (500km)'},
            {value: '1000000', label: 'Vast (1000km)'}
        ];

        $scope.types = [
            'city', 'town', 'village', 'forest', 'hills', 'mountains', 'desert', 'ocean', 'lake', 'river', 'swamp', 'building', 'room', 'hall', 'cave'
        ];

        $scope.save = function () {
            $modalInstance.close($scope.pip);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        }
    }

    angular.module('NERDS_app').controller('ModalTileEditor', ModalTileEditor);

    // --------------------------- place graph ---------------------------------

    app.factory('placeGraph', function (Places) {

        return function($scope, GAME_ID, $modal){

            var scope_ele = $('#game_creation');
            var create_canvas = scope_ele.find('#create_canvas')[0];

            var stage = new createjs.Stage(create_canvas);
            var backdrop = new createjs.Container();
            stage.addChild(backdrop);
            var PIP_SIZE = Math.floor(create_canvas.width / 5);
            var pips = [];
            for (var r = 0; r < create_canvas.width / PIP_SIZE; ++r) {
                for (var c = 0; c < create_canvas.height / PIP_SIZE; ++c) {
                    var pip = _add_pip(r, c, PIP_SIZE);
                    backdrop.addChild(pip);
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


            $scope.edit_tile = function (pip) {
                console.log('opening pip ', pip);
                $scope.pip = pip;

                var modalInstance = $modal.open({
                    templateUrl: 'modalTileEditor.html',
                    controller: ModalTileEditor,
                    resolve: {
                        game: function () {
                            return $scope.game;
                        },
                        pip: function () {
                            return $scope.pip;
                        }
                    }
                });
                $scope.$apply();

                modalInstance.result.then(function (pip) {
                    console.log('done with pip ', pip);
                    var place_data = {
                        game: GAME_ID,
                        name: pip.name,
                        row: pip.r,
                        column: pip.c,
                        type: pip.type,
                        description: pip.description,
                        size: pip.size
                    };
                    Places.put(place_data, function () {
                        $scope.places = Places.query({game: GAME_ID})
                    });

                    //@TODO: allow for manual size/type
                });
            };

            return {
                stage: stage
            };
        }
    });

    function _random_color() {
        var b = Math.floor((Math.random() + Math.random() + Math.random() - Math.random()) * 128);
        return 'rgb(' + b + ',' + b + ',' + b + ')';
    }

    function _add_pip(r, c, PIP_SIZE) {
        var pip = new createjs.Shape();
        pip.graphics.beginFill(_random_color()).drawRect(0, 0, PIP_SIZE, PIP_SIZE);
        pip.x = r * PIP_SIZE;
        pip.y = c * PIP_SIZE;
        return pip;
    }

})();
