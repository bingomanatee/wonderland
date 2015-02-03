/* globals define */
define(function (require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var Surface = require('famous/core/Surface');
    var Button = require('story/Button');

    var LIST_ITEM_HEIGHT = 40;

    var DEFAULT_OPTIONS = {
        elementType: 'h2',
        size: [undefined, LIST_ITEM_HEIGHT],
        classes: ['list-item']
    };

    function StoryListItem(options, story) {
        if (!options) {
            options = {};
        }

        for (var p in DEFAULT_OPTIONS) if (DEFAULT_OPTIONS.hasOwnProperty(p) && !options.hasOwnProperty(p)) {
            options[p] = DEFAULT_OPTIONS[p];
        }
        console.log('Made content from ', options);
        Surface.call(this, options);
        this.setContent('Story &quot;' + story.title + '&quot;');
    }
    StoryListItem.prototype = Object.create(Surface.prototype);
    StoryListItem.prototype.constructor = StoryListItem;

    module.exports = StoryListItem;
});
