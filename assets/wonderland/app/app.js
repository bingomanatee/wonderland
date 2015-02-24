var wonderlandApp = angular.module('WonderlandApp',
  ['ngResource', 'ngSanitize', 'ui.grid', 'ui.grid.selection', 'ui.bootstrap'])
.factory('filterCode', function(){
  return function(title){
    if (!title || (typeof title != 'string')) return '';
    return title.replace(/[^\w\d\-_]/gi, '').toLowerCase();
  }
});