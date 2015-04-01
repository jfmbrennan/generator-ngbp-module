/**
 * app.js - Main app
 */

angular.module('ngbp', [
  'templates-app',
  'templates-common',
  'ui.router',
  'ngResource',
  'ngCookies'
])

.config(function myAppConfig ($locationProvider, $httpProvider, $sceDelegateProvider, $logProvider, $urlRouterProvider) {

  $logProvider.debugEnabled(true);

})

.run(function runApp ($location, $rootScope) {


})

.controller('AppCtrl', function AppCtrl ($scope, $rootScope, $state, $log, $location, $cookieStore, $window) {

  $log.debug('AppCtrl() loaded on ' + new Date());

  $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

    if (angular.isDefined(toState.data.pageTitle)) {
      $scope.pageTitle = toState.data.pageTitle + ' | ngbp template';
    }

  });

});
