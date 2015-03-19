/**
 * This is the default 'home' module/controller
 */

angular.module('HomeCtrl', [
	'ngResource', 'ngCookies', 'ui.router'
])

.config(function config ($stateProvider) {

	$stateProvider.state('home', {
		url  : '/home',
		views: {
			'': {
				templateUrl: 'home/home.tpl.html'
			}
		},
		data : { pageTitle: 'Home Page' }
	});

})

.controller('HomeCtrl', function HomeCtrl ($scope, $rootScope, $log) {

});