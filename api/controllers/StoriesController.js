/**
 * StoriesController
 *
 * @description :: Server-side logic for managing stories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var util = require('util');

module.exports = {
	post: function(req, res){
    util.log('posting story');

    if (req.session.account) {
      var newStory = {
        title: req.param('title'),
        description: req.param('description'),
        createdBy: req.session.account.id,
        createdUsername: req.session.account.username
      };

      util.log(util.format('saving story %s...', util.format(newStory)));

       Stories.create(newStory).exec(function(err, result){

        util.log(util.format('story saved: err %s, reault %s',
        util.inspect(err), util.inspect(result)
        ));
        if (err){
          res.json({error: err});
        } else {
          res.json({story: result});
        }
      });

    } else {
      req.json({error: 'You must be logged in to create a story'});
    }
  }
};

