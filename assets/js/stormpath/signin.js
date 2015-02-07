(function () {

  var lockForm;

  var form = $('#signInForm');
  var usernameField = form.find('.username');
  var passwordField = form.find('.password');

  if (typeof(reloadURL) == 'undefined') {
    var reloadURL = false;
  }
  function _lockForm(lock) {
    lock = !!lock;

    if (lock) {
      form.find('.submit-buttons').css('display', 'none');
      form.find('.wait-message').css('display', 'block');
    } else {
      form.find('.submit-buttons').css('display', 'block');
      form.find('.wait-message').css('display', 'none');
    }
    lockForm = lock;
  }

  form.submit(function () {
    if (lockForm) {
      return;
    }

    form.find('.error-message').hide();
    var username = usernameField.val();
    var password = passwordField.val();
    console.log("submitting signin: ", username, password);
    _lockForm(true);

    $.post('/signin', {username: username, password: password}).done(function (data) {

      console.log('feedback from signin: ', data);
      if (data.error) {
        form.find('.error-message').show().find('span').text(data.error);
        form.find('.username').focus();

        _lockForm((false))
      } else {
        if (reloadURL && (document.location.pathname != reloadURL)) {
          document.location.href = reloadUrl;
        } else {
          document.location.reload();
        }
      }

    });
    return false;
  });
  console.log('submit found');

})();
