/**
 * <%= name %> Module
 */

angular.module('<%= name %>', [
<% if (templateModule) { %>
'templates-app',
'templates-common',
<% } %>
<% if (uiRouterModule) { %>'ui.router',<% } %>
<% if (ngResourceModule) { %>'ngResource',<% } %>
<% if (ngCookiesModule) { %>'ngCookies',<% } %>
])

  .config(function config($stateProvider) {

    $stateProvider.state('<%= lowerModuleName %>', {
      url: '/<%= lowerModuleName %>',
      templateUrl: '<%= lowerModuleName %>/views/<%= lowerModuleName %>.tpl.html'
    });
  })

  .controller('<%= capitalModuleName %>Ctrl', function <%= capitalModuleName %>Ctrl($scope) {

  });
