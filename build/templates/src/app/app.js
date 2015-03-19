/**
 * app.js - Main app
 */

angular.module('ngbp', [

  // html templates
  'templates-app', 'templates-common',

  // vendor dependencies
  'ui.router', 'ngResource', 'ngCookies',

  // modules, controllers and services
  'HomeCtrl'
])

.config(function myAppConfig ($locationProvider, $httpProvider, $sceDelegateProvider, $logProvider, $urlRouterProvider) {

  $logProvider.debugEnabled(true);

  $urlRouterProvider.otherwise('/home');

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
