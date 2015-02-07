var util = require('util');

module.exports = function (req, res, next) {
  var baseView = res.view;
  util.log('**************** injecting account');
  res.view = function (path, options) {
    util.log(util.format('.....rendering %s', path));
    var mixins = {
      account: req.session.account || false,
      flashMessages: FlashService.flashMessages(req)
    };

    if (options) {
      options = _.defaults(options, mixins);
    } else {
      options = mixins;
    }

    baseView.call(res, path, options);
  };

  return next();
};
