var util = require('util');

module.exports = function (req, res, next) {
  var baseView = res.view;

  res.view = function (path, options) {

    var mixins = {
      account: req.session.account || false,
      flashMessages: FlashService.flashMessages(req)
    };

    options = options|| (typeof options == 'object') ? _.defaults(options, mixins) : mixins;

    baseView.call(res, path, options);
  };

  return next();
};
