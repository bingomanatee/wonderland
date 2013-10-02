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

console.log('nm1: ', __filename);
/* ******* CLOSURE ********* */

var _sidebar;

/* ********* EXPORTS ******** */

module.exports = function (apiary, cb) {

    fs.readFile(path.resolve(__dirname, 'sidebar_template.html'), 'utf8', function (err, txt) {

        _sidebar = ejs.compile(txt);

        var helper = {

            name: 'nerds_layout_menu',

            test: function (ctx, output) {
                //	console.log('testing %s for layout_name hive_blog', util.inspect(output));
                return true; // output.layout_name == 'nerds';
            },

            weight: -50,

            respond: function (ctx, output, done) {
                if (!output.helpers) {
                    output.helpers = {};
                }

                var nerds_menu = new hm.Menu({
                    name: 'nerds',
                    title: 'Nerds',
                    items: [
                        {name: 'games', title: 'NERDS', link: '/nerds/games'}
                    ]
                });

                output.helpers.sidebar_menu_data.add(nerds_menu);

                done();
            }
        };

        cb(null, helper);

    })

};