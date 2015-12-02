//Setting up the angular app (module)
// var myApp = angular.module('myApp',[]);
var myApp = angular.module('myApp',['ngRoute','ui.bootstrap']);
//partial code goes in here:
// config method to setup routing
myApp.config(function($routeProvider,$locationProvider){
	$routeProvider
		.when('/',{
			templateUrl: 'partials/home.html',
			controller: 'locsCtrl'
		})
		// .when('/edit/:userId',{
		// 	templateUrl: 'partials/edit.html',
		// 	controller: 'usersDetailCtrl'
		// })
		.otherwise({
			redirectTo: '/'
		});

		// use the HTML5 History API
    $locationProvider.html5Mode(true);
});
