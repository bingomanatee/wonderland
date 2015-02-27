/**
 * StoryPagesController
 *
 * @description :: Server-side logic for managing Storypages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var util = require('util');

module.exports = {
  for_story: function (req, res) {
    StoryPages.find({story: req.param('id')}, function (err, pages) {
      //util.log(util.format('got story pages: %s (err %s)',
      //   util.inspect(pages), util.inspect(err)));

      if (err) {
        return res.json({error: err.message});
      }
      pages.forEach(function (page) {
        delete page.body;
      });
      res.json({pages: pages});
    });
  },

  uniqueCode: function (req, res) {
    StoryPages.uniqueCode(req.param('story'), req.param('code'), function (err, uniqueCode) {
      if (err) {
        res.json({error: err.message});
      } else {
        res.json({code: uniqueCode});
      }
    });
  },

  uniqueCodeForPage: function (req, res) {
    StoryPages.uniqueCodeForPage(req.param('page'), function (err, uniqueCode) {
      if (err) {
        res.json({error: err.message});
      } else {
        res.json({code: uniqueCode});
      }
    });
  }

};

