(function () {

    var column = 0;
    var app = angular.module('NERDS_app');

    _cellTemplate = _.template('<button type="button" class="<%= button_class %>" ng-click="<%= action %>"><%= label %></button>');

    app.factory('grid_button', function () {
        return function (params) {
            params.button_class = 'btn';

            if (params.type) params.button_class += ' btn-' + params.type;

            _.defaults(params,
                {
                    name: 'col_' + column++,
                    width: '*',
                    label: 'Go',
                    title: '&nbsp;'
                }
            );

            return  {name: params.name, title: params.title, cellTemplate: _cellTemplate(params),
                width: params.width };
        }
    });
})
    (window);