/**
 * <%= capitalModuleName %> Module
 */

angular.module('<%= moduleName %>', [<%= moduleDependencies %>])
  .config(function config($stateProvider) {
    $stateProvider.state('<%= lowerModuleName %>', {
      url: '/<%= lowerModuleName %>',
      templateUrl: '<%= lowerModuleName %>/views/<%= lowerModuleName %>.tpl.html',
      data : { pageTitle: '<%= capitalModuleName %> Page' }
    });
  });
