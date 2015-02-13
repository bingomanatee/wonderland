function FlashMessages(req) {
  this.req = req;
}

function _flatten(msg) {
  var out = [];

  for (var msgType in msg) {
    if (msg.hasOwnProperty(msgType) && _.isArray(msg[msgType])) {
      msg[msgType].forEach(function (msg) {
        out.push({msgType: msgType, content: msg});
      });
    }
  }

  return out;
}

FlashMessages.prototype = {
  pullMessages: function (flat) {
    if (this.req.session.flash) {
      var msg = this.req.session.flash;
      delete this.req.session.flash;
      return flat ? _flatten(msg) : msg;
    }
    return flat ? [] : {};
  },
  addMessage: function (msgType, content) {
    if (!this.req.session.flash) {
      this.req.session.flash = {};
    }
    if (!this.req.session.flash[msgType]) {
      this.req.session.flash[msgType] = [];
    }
    this.req.session.flash[msgType].push(content);
  },
  hasMessages: function () {
    if (!this.req.session.flash) {
      return false;
    }
    for (var p in this.req.session.flash) {
      if (_.isArray(this.req.session.flash[p]) && this.req.session.flash[p].length) {
        return true;
      }
    }
    return false;
  }
};

module.exports = {
  flashMessages: function (req) {
    return new FlashMessages(req);
  },
  addMessage: function (req, msgType, content) {
    this.flashMessages(req).addMessage(msgType, content);
  }
};
