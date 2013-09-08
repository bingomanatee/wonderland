var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;
var walk = require('walk')

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = {

    on_validate: function (context, callback) {
        var member_model = this.model('member');
        member_model.ican(context, ['administer site'], callback, {
            go: '/',
            message: 'You do not have authorization to administer the site',
            key: 'error'
        })
    },

    on_input: function (context, done) {

        console.log('alias: %s', context.alias);
        var apiary = this.get_config('apiary');
        var root2 = apiary.get_config('root');
        var fpath = context.prefix.replace(/^frames\//, '');
        var file_root = path.resolve(root2, fpath);

        console.log('file root: %s', file_root);
        var walker = walk.walk(file_root);
        var files = [];

        walker.on('names', function (root, nameArray, next) {
            console.log('names: %s, %s', root, nameArray.join(','));
            files = files.concat(nameArray.map(function (name) {
                return path.resolve(root, name);
            }));
            if (next) next();
        });

        walker.on('end', function () {
            context.$send(files.map(function(file){
                return {file: context.alias + file.replace(new RegExp('^' + file_root), '')};
            }), done);
        })

    }

} // end action