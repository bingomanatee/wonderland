(function () {

    var app = angular.module('NERDS_app');

    app.directive('anchorFormElement', function InjectingFunction() {

        // === InjectingFunction === //
        // Logic is executed 0 or 1 times per app (depending on if directive is used).
        // Useful for bootstrap and global configuration

        return {
            template: ' <div class="controls"><table>' +
                '<tr><td><label class="radio"><input type="radio" name="anchor" ng-model="thing.anchor" value="TL"/>TL</label></td>' +
                '<td><label class="radio"><input type="radio" name="anchor"  ng-model="thing.anchor" value="T"/>Top</label></td>' +
                '<td><label class="radio"><input type="radio"  name="anchor" ng-model="thing.anchor" value="TR"/>TR</label></td></tr><tr><td><label class="radio"><input type="radio" name="anchor"  ng-model="thing.anchor" value="L"/>Left</label></td>' +
                '<td><label class="radio"><input type="radio" name="anchor" checked="checked" ng-model="thing.anchor" value="C"/>(center)</label></td>' +
                '<td><label class="radio"><input type="radio" name="anchor"  ng-model="thing.anchor" value="R"/>Right</label></td></tr><tr><td><label class="radio"><input type="radio"  name="anchor" ng-model="thing.anchor" value="BL"/>BL</label></td>' +
                '<td><label class="radio"><input type="radio" name="anchor"  ng-model="thing.anchor" value="B"/>Bottom</label></td>' +
                '<td><label class="radio"><input type="radio" name="anchor"  ng-model="thing.anchor" value="BR"/>BR</label></td></tr></table></div>',
            compile: function CompilingFunction($templateElement, $templateAttributes) {

                // === CompilingFunction === //
                // Logic is executed once (1) for every instance of ui-jq in your original UNRENDERED template.
                // Scope is UNAVAILABLE as the templates are only being cached.
                // You CAN examine the DOM and cache information about what variables
                //   or expressions will be used, but you cannot yet figure out their values.
                // Angular is caching the templates, now is a good time to inject new angular templates
                //   as children or future siblings to automatically run..

                return function LinkingFunction($scope, $linkElement, $linkAttributes) {

                    // === LinkingFunction === //
                    // Logic is executed once (1) for every RENDERED instance.
                    // Once for each row in an ng-repeat when the row is created.
                    // If ui-if or ng-switch may also affect if this is executed.
                    // Scope IS available because controller logic has finished executing.
                    // All variables and expression values can finally be determined.
                    // Angular is rendering cached templates. It's too late to add templates for angular
                    //  to automatically run. If you MUST inject new templates, you must $compile them manually.

                };
            }
        };
    })

})(window)