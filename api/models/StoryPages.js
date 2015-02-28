/**
 * StoryPages.js
 *
 * @description :: This is a page in a story.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    title: {type: 'string'},

    code: {type: 'string'},

    body: {type: 'text'},

    story: {
      model: 'stories'
    },

    jumps:{
      collection: 'storyjumps',
      via: 'story'
    }

  /*,

    jumps: function (callback) {
      if (this.id) {
        StoryJumps.find({fromStory: this.id})
          .sort({order: 'asc'}).exec(callback);
      } else {
        callback(null, []);
      }
    } */
  },

  filterCode: function (str) {
    return str.replace(/[^\w\d\-_]/gi, '').toLowerCase();
  },

  uniqueCodeForPage: function (id, callback) {
    StoryPages.findOne({id: id}, function (err, item) {
      if (err) {
        return callback(err);
      } else if (!item) {
        return callback({error: 'cannot find page ' + id});
      } else {
        StoryPages.find({story: item.story}, {fields: ['id', 'story', 'code']})
          .exec(function (err, pages) {
            if (err) {
              return callback(err);
            }
            pages = _.reject(pages, function (page) {
              return page.id == id;
            });

            _uniqueCodes(pages, item.code, callback);
          })
      }
    })
  },

  uniqueCode: function (story, code, callback) {
    StoryPages.find({story: story}, {fields: ['id', 'story', 'code']})
      .exec(function (err, pages) {
        if (err) {
          return callback(err);
        }

        _uniqueCodes(pages, code, callback);
      });
  }
};

function _uniqueCodes(pages, code, callback) {
  var codes = _.pluck(pages, 'code');

  if (_.contains(codes, code)) {
    var index = 1;
    var _newCodet = _.template('<%= code %>_<%= index %>');
    var _newCode = function () {
      return _newCodet({code: code, index: index});
    };
    while (_.contains(codes, _newCode())) {
      ++index;
    }
    callback(null, _newCode());
  } else {
    callback(null, code);
  }
}
