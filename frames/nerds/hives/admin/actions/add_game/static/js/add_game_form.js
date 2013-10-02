$(function () {
    var form = $('#add_game');
    form.submit(function () {
        var form_data = _.reduce(form.serializeArray(), function (out, value) {
            out[value.name] = value.value;
            return out;
        }, {});

        $.ajax('/admin/nerds/games/add', {method: 'put', data: form_data }).done(function (result, result_type) {
            console.log('result:', result);
          //  document.location = '/nerds/games'
        });
        return false;
    })
})