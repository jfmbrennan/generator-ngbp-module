/**
 * To include this module in the app routes
 * You have to add 'ExampleCtrl' under the angular.module
 * dependencies in the app.js file
 */
angular.module('ExampleCtrl', [
	'ngResource', 'ngCookies', 'ui.router'
])

.config(function config ($stateProvider) {

	$stateProvider.state('example', {
		url  : '/example',
		views: {
			'': {
				templateUrl: 'example/example.tpl.html'
			}
		},
		data : { pageTitle: 'Example Page' }
	});

})

.controller('ExampleCtrl', function ExampleCtrl ($scope, $rootScope, $log) {

});