/* globals define */
define(function (require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var Surface = require('famous/core/Surface');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
    var StateModifier = require('famous/modifiers/StateModifier');
    var View = require('famous/core/View');
    var Scrollview = require('famous/views/Scrollview');
    var ScrollContainer = require('famous/views/ScrollContainer');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var ToggleButton = require('famous/widgets/ToggleButton');
    var Utility = require('famous/utilities/Utility');

    var BUTTON_WIDTH = 200;
    var BUTTON_HEIGHT = 30;

    var DEFAULTS = {
        size: [BUTTON_WIDTH, BUTTON_HEIGHT],
        offClasses: ['button'],
        onClasses: ['button', 'on'],
        toggleMode: ToggleButton.OFF,
        properties: {zIndex: 100},
        crossfade: true
    };

    function Button(label, options){
        if (!options) options = Utility.clone(options);
        else {
            var o = Utility.clone(DEFAULTS);
            for(var p in options){
                o[p] = options[p];
            }
            options = o;
        }

        if (typeof label == 'object') options = label;
        else if (!options){
            options = {content: label};
        } else {
            options.content = label;
        }

        ToggleButton.call(this, options);

        this.on('mouseover', function () {
            this.select();
        });

        this.on('mouseout', function () {
            this.deselect();
        });
    }

    Button.prototype = Object.create(ToggleButton.prototype);
    Button.prototype.constructor = Button;

    module.exports = Button;

});
