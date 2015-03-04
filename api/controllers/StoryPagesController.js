/**
 * StoryPagesController
 *
 * @description :: Server-side logic for managing Storypages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var util = require('util');

module.exports = {
  for_story: function (req, res) {
    StoryPages.find({story: req.param('id')}).populate('jumps').exec(function (err, pages) {
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

  as_graph: function (req, res) {
    StoryPages.find({story: req.param('id')})
      .populate('jumps')
      .exec(function (err, pages) {
        if (err) {
          res.json({error: err.message, nodes: [], links: []});
        } else {
          pages = _.sortBy(pages, 'id');
          var nodes = _.map(pages, function (page) {
            return {name: page.title, group: 0, '$id': page.id};
          });
          var id_array = _.pluck(pages, 'id');
          var links = _.flatten(_.map(pages, function (page) {
            var fromIndex = _.indexOf(id_array, page.id);
            return _.compact(_.map(page.jumps, function (jump) {
              var toPage = _.find(pages, 'code', jump.toPageCode);
              if (!toPage) {
                return false;
              }
              var toIndex = _.indexOf(id_array, toPage.id);
              if (toPage.id == page.id) {
                return false;
              }
              return({source: fromIndex, '$jump_id': jump.id, '$from_page': page.id, '$to_page': toPage.id, target: toIndex, value: 8});
            }));
          }));
          res.json({nodes: nodes, links: links});
        }
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
  }

  ,

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

