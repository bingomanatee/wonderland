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
    var NewStoryForm = require('story/NewStoryForm');
    var StoryListItem = require('story/StoryListItem');

    // var ImageSurface = require('famous/surfaces/ImageSurface');

    var TOOLBAR_HEIGHT = 50;
    var FOOTER_HEIGHT = 30;

    this.WL_DOMAIN = 'http://localhost:1337';

    var MARGIN = 50;

    var CONTENT_TOP_MARGIN = 150;

    var width = window.innerWidth;
    var height = window.innerHeight;

    function bodyHeight() {
        return height - TOOLBAR_HEIGHT - FOOTER_HEIGHT;
    }

    // create the main context
    var mainContext = Engine.createContext();

    // your app here
    mainContext.setPerspective(1000);

    var layout = new HeaderFooterLayout({
        headerSize: TOOLBAR_HEIGHT,
        footerSize: FOOTER_HEIGHT
    });

    var toolbar = new View({size: [undefined, TOOLBAR_HEIGHT]});
    toolbar.add(new Surface({classes: ['toolbar']}));

    var titleTransform = new StateModifier({
        origin: [0.5, 0.5],
        transform: Transform.translate(width / 2, TOOLBAR_HEIGHT / 2, 0)
    });

    window.addEventListener("resize", function () {
        width = window.innerWidth;
        height = window.innerHeight;
        //  console.log('Sizing element based on width ', width);
        titleTransform.setTransform(Transform.translate(width / 2, TOOLBAR_HEIGHT / 2, 0));
        // list.setSize([width, bodyHeight()- CONTENT_TOP_MARGIN]);
        list.container.setSize([width, bodyHeight() - CONTENT_TOP_MARGIN]);
        //list.scrollview._scroller.setSize([width, bodyHeight() - CONTENT_TOP_MARGIN]);
        listMod.setSize([width, bodyHeight() - CONTENT_TOP_MARGIN]);
        list.container.setClasses(['container-CLASS']);
        newStoryForm._resize(width, height);
    });

    var headline = new Surface({content: "Stories", size: [true, true], classes: ['c'], properties: {}});
    headline.elementType = 'h1';

    toolbar.add(titleTransform)
        .add(headline);

    layout.header.add(toolbar);
    var footerToolbar = new Surface({
        classes: ['toolbar']
    });

    var mainSurface = new Surface({classes: ['main-surface']});

    layout.footer.add(footerToolbar);

    layout.content.add(mainSurface);

    // var list = new Scrollview({size: [true, 200], direction: 1, classes: ['list'], style: {overflow: 'hidden'}}, [300, 300]);
    var list = new ScrollContainer({
        container: {size: [width, bodyHeight() - CONTENT_TOP_MARGIN]},
        direction: 1,
        classes: ['list'],
        style: {overflow: 'hidden'}
    });

    var items = [new StoryListItem({}, {title: 'sample'})];
    /*  for (var i = 0; i < 30; ++i) {
     var surface = new Surface({
     content: 'Item ' + i,
     elementType: 'h2',
     size: [undefined, LIST_ITEM_HEIGHT],
     classes: ['list-item']
     });
     surface.pipe(list);
     items.push(surface);
     }*/

    this.reloadStories = function() {

        $.get(this.WL_DOMAIN + '/stories').done(function (data) {
            data = _.sortBy(data, function(item){
                return item.id * -1;
            });
            console.log('data: ', data);
            var listItems = [];
            for (var i = 0; i < data.length; ++i) {
                listItems.push(new StoryListItem({}, data[i]));
            }
            console.log("list items", listItems);
            list.sequenceFrom(listItems);
        });
    }

    this.reloadStories();

    list.sequenceFrom(items);
    var listMod = new Modifier({transform: Transform.translate(0, CONTENT_TOP_MARGIN, 0)});
    layout.content.add(listMod).add(list);

    var controls = new ContainerSurface({size: [width, CONTENT_TOP_MARGIN]});
    // controls.add(new Surface({content: 'cs',size: [width, CONTENT_TOP_MARGIN], properties: {color: 'white', backgroundColor: 'rgb(100,0,0)'}}));

    var newStoryButton = new ToggleButton({
        content: "New Story",
        size: [120, 30],
        offClasses: ['button'],
        onClasses: ['button', 'on'],
        inTransition: {curve: 'easeInOut', duration: 100},
        toggleMode: ToggleButton.OFF
    });

    newStoryButton.on('mouseover', function () {
        newStoryButton.select();
    });

    newStoryButton.on('mouseout', function () {
        newStoryButton.deselect();
    });

    newStoryButton.on('click', function () {
        this.showNewStoryForm(true);
    }.bind(this));

    controls.add(new StateModifier({
        origin: [0, 0.5],
        align: [0, 0.5],
        transform: Transform.translate(MARGIN, 0, 0)
    }))
        .add(newStoryButton);
    layout.content.add(new Modifier({origin: [0, 0]})).add(controls);

    var newStoryForm = new NewStoryForm(this);

    var nsfMod = new Modifier({
        origin: [0.5, 0],
        align: [0.5, 0],
        opacity: 0
    });

    mainContext.add(layout);
    mainContext.add(nsfMod).add(newStoryForm);

    this.showNewStoryForm = function (show) {
        if (arguments.length < 1) {
            show = true;
        }

        if (show) {
            nsfMod.setOpacity(1);
            nsfMod.setTransform(Transform.identity);
        } else {
            nsfMod.setOpacity(0);
            nsfMod.setTransform(Transform.translate(0, 0, 10));
        }
    }

    setTimeout(function () {
        //       this.showNewStoryForm(true);
    }.bind(this), 2000);
});
