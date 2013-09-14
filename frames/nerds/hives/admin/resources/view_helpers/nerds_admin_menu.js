var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var moment = require('moment');
var ejs = require('ejs');
var hm = require('hive-menu');

/* ************************************
 *
 * ************************************ */

/* ******* CLOSURE ********* */

var _sidebar;

/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {

    var helper = {

        name: 'nerds_admin_layout_menu',

        test: function (ctx, output) {

            return (output.layout_name == 'admin') && (output.helpers.sidebar_menu_data)
        },

        weight: 0,

        respond: function (ctx, output, done) {
            if (!output.helpers) {
                output.helpers = {};
            }

            var nerd_menu = new hm.Menu({
                name: 'nerds',
                title: 'Nerdministration',
                items: [
                    {name: 'games', title: 'Games', link: '/admin/nerds/games', weight: -100},
                    {name: 'skills', title: 'Skills', link: '/admin/nerds/skills', weight: 0},
                    {name: 'things', title: 'Things', link: '/admin/nerds/things', weight: 0}
                ]
            })


            output.helpers.sidebar_menu_data.add(nerd_menu);

            done();
        }
    };

    cb(null, helper);

};