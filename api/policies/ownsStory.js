var util = require('util');

module.exports = function(req, res, next){
  // assuming other policies have validated existence of account
  var id = parseInt(req.param('id'));
  if (id) {
    Stories.findOne({id: id}, function (err, story) {
      if (story && story.id) {
        res.$story = story; // saving the story for downstream use to save a request
        util.log(util.format('found story %s: %s', id, util.inspect(story)));
        next();
      } else {
        FlashService.addMessage(req, 'danger', 'Cannot find story id ' + id);
        res.redirect('/');
      }
    })
  } else {
    FlashService.addMessage(req, 'danger', 'Cannot find a story ID in this request');
    res.redirect('/');
  }

};
