module.exports = function (req, res, next) {
  if (!req.session.account) {
    FlashService.addMessage(req, 'danger', 'you must be logged in to view this page.');
    res.redirect('/');
  } else {
    next();
  }
};
