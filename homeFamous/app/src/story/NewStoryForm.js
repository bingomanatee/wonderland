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
    var InputSurface = require('famous/surfaces/InputSurface');
    var TextareaSurface = require('famous/surfaces/TextareaSurface');
    var Button = require('story/Button');

    var FORM_HEIGHT = 300;
    var FORM_WIDTH = 500;
    var MARGIN = 8;
    var FORM_WIDTH_INNER = FORM_WIDTH - (2 * MARGIN);
    var FORM_HEIGHT_INNER = FORM_HEIGHT - (2 * MARGIN);
    var FOOTER_HEIGHT = 30;
    var BUTTON_WIDTH = 120;
    var LABEL_HEIGHT = 30;
    var INPUT_HEIGHT = 30;
    var X_SIZE = 50;

    function NewStoryForm(context) {
        View.apply(this, arguments);

        var root = this.add(new Modifier({
            origin: [0.5, 0],
            anchor: [0.5, 0]
        }));

        this._form = new Surface({
            classes: ['form'],
            size: this._formSize()
        });
        root.add(this._form);

        this._irMod = new Modifier({
            size: this._innerSize(),
            //    origin: [0.5, 0],
            // anchor: [0.5, 0],
            transform: Transform.translate(0, MARGIN)
        });

        this._innerRoot = root.add(this._irMod);

        this._layout = new HeaderFooterLayout({
            size: this._innerSize(),
            headerSize: 40, footerSize: FOOTER_HEIGHT
        });

        this._layout.header.add(new Surface(
            {content: '<h2 class="formtitle">Create a New Story</h2>'}));

        this._innerRoot.add(this._layout);

        this._xTransform = new Modifier({transform: Transform.translate(FORM_WIDTH_INNER - X_SIZE, 0, 0)});
        this._xSurface = new Button({
            content: '<img src="content/images/circle_x.svg" />',
            onClasses: ['on', 'x'],
            offClasses: ['off', 'x'],
            size: [X_SIZE, X_SIZE]
        });

        this._xSurface.on('click', function () {
            context.showNewStoryForm(false);
        });

        this._xSurface.onSurface.setContent('<img src="content/images/circle_x_hover.svg" />');

        this._layout.header.add(this._xTransform).add(this._xSurface);

        var createButton = new Button("Create", {size: [BUTTON_WIDTH, FOOTER_HEIGHT]});

        createButton.on('click', function () {
            var title = this._titleInput.getValue();
            var desc = this._descInput.getValue();

            if (title && desc) {
                console.log("Saving story", title, desc);

                $.ajax({
                    url: context.WL_DOMAIN + '/stories',
                    dataType: 'json',
                    type: 'POST',
                    data: {
                        title: title,
                        description: desc
                    }
                }).done(function (result) {
                    console.log('result of put:', result);
                    context.reloadStories(result);
                });
            }
            context.showNewStoryForm(false);
        }.bind(this));

        this._buttonModifier = new StateModifier({
            transform: Transform.translate(FORM_WIDTH_INNER - BUTTON_WIDTH, 0, 1)
        });

        this._layout.footer.add(new Surface({
            size: [FORM_WIDTH_INNER, FOOTER_HEIGHT]//,
            //  properties: {backgroundColor: 'rgba(255,0,0,0.85)'}
        }));
        this._layout.footer.add(this._buttonModifier).add(createButton);

        this._titleLabel = new Surface({content: 'Title', classes: ['label'], size: [FORM_WIDTH_INNER, LABEL_HEIGHT]});
        this._layout.content
            .add(new Modifier())
            .add(this._titleLabel);

        this._titleInput = new InputSurface({
            value: '',
            placeholder: 'title of story',
            classes: ['input', 'one-line'],
            size: [FORM_WIDTH_INNER, INPUT_HEIGHT]
        });
        this._layout.content
            .add(new Modifier({transform: Transform.translate(0, LABEL_HEIGHT)}))
            .add(this._titleInput);

        this._descLabel = new Surface({
            content: 'Description',
            classes: ['label'],
            size: [FORM_WIDTH_INNER, LABEL_HEIGHT]
        });
        this._layout.content
            .add(new Modifier({transform: Transform.translate(0, 2 * LABEL_HEIGHT)}))
            .add(this._descLabel);

        this._descInput = new TextareaSurface({
            value: '',
            placeholder: 'description of story',
            classes: ['textarea', 'three-line'],
            size: [FORM_WIDTH_INNER, 3 * INPUT_HEIGHT]
        });
        this._layout.content
            .add(new Modifier({transform: Transform.translate(0, 3 * LABEL_HEIGHT)}))
            .add(this._descInput);

        this._resize(window.innerWidth, window.innerHeight);
    }

    NewStoryForm.prototype = Object.create(View.prototype);
    NewStoryForm.prototype.constructor = NewStoryForm;

    NewStoryForm.prototype._resize = function (w, h) {
        this._form.setSize(this._formSize(w, h));
        this._irMod.setSize(this._innerSize(w, h));
        this._titleInput.setSize([this._innerSize(w, h)[0], INPUT_HEIGHT]);
        this._buttonModifier.setTransform(Transform.translate(this._innerSize(w, h)[0] - BUTTON_WIDTH, 0, 1));
        this._xTransform.setTransform(Transform.translate(this._innerSize(w, h)[0] - X_SIZE, 0, 0));
    };

    NewStoryForm.prototype._formSize = function (w, h) {

        if (!w) {
            w = window.innerWidth;
        }

        if (!h) {
            h = window.innerHeight;
        }
        w -= 2 * MARGIN;
        h -= 2 * MARGIN;
        console.log('form size: ', w, h, FORM_WIDTH, FORM_HEIGHT);
        return [Math.min(w, FORM_WIDTH), Math.min(h, FORM_HEIGHT)];
    };

    NewStoryForm.prototype._innerSize = function (w, h) {

        if (!w) {
            w = window.innerWidth;
        }

        if (!h) {
            h = window.innerHeight;
        }
        w -= 4 * MARGIN;
        h -= 4 * MARGIN;

        return [Math.min(w, FORM_WIDTH_INNER), Math.min(h, FORM_HEIGHT_INNER)];
    };

    module.exports = NewStoryForm;

});
