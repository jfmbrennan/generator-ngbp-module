/**
 * <%= capitalModuleName %> Module
 */

angular.module('<%= appModuleName %>', [<%- moduleDependencies %>])
  .config(function config($stateProvider) {
    $stateProvider.state('<%= lowerModuleName %>', {
      url: '/<%= lowerModuleName %>',
      templateUrl: '<%= lowerModuleName %>/partials/<%= lowerModuleName %>.tpl.html',
      data : { pageTitle: '<%= capitalModuleName %> Page' }
    });
  });
