var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');

/* ------------ CLOSURE --------------- */
console.log('nmc loaded');

/** ********************
 * Purpose: connect to a mongoose DB for nerds
 * @return void
 */

function nerds_mongoose_connect(apiary, callback) {
    callback(null, {
        name: 'nerds_mongoose_connect',
        respond: function (done) {
            console.log('connecting to mongoose');
            mongoose.connect('mongodb://localhost/nerds');
            apiary.set_config('nerds_mongoose', mongoose);
            done();
        }
    });
}

/* -------------- EXPORT --------------- */

module.exports = nerds_mongoose_connect;