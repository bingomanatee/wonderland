var util = require('util');

module.exports = function (req, res, next) {

  var baseView = res.view;
  // util.log('**************** injecting account');
  res.view = function (path, options) {

    var mixins = {
      test_mode: req.param('test_mode') || 0
    };

    options = options|| (typeof options == 'object') ? _.defaults(options, mixins) : mixins;

    baseView.call(res, path, options);
  };

  return next();
};
