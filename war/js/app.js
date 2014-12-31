'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
  'ngTouch',
  'ngDialog',
  'pascalprecht.translate',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'myApp.animations'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.when('/view3', {templateUrl: 'partials/partial3.html', controller: 'MyCtrl3'});
  $routeProvider.otherwise({redirectTo: '/view3'});
}]).
config(['$translateProvider', function($translateProvider){
	$translateProvider.translations('AR', {
	    LEVEL: 'مستوى',
	    START: 'بداية',
	    END_OF_GAME: 'انتهى',
	    TRY_AGAIN:  'حاول مرة أخرى',
	    NEXT_LEVEL: 'للمستوى التالي'
	  });
	  $translateProvider.translations('HE', {
	    LEVEL: 'שלב',
	    START: 'התחל',
	    END_OF_GAME: 'סוף המשחק'	,
	    TRY_AGAIN: 'נסה שוב',
	    NEXT_LEVEL: 'עבור שלב',
	    YOUR_NAME: 'השם שלך',
	    NAME_NOT_EXIST: 'השם אינו קיים במערכת',
	    NAME_NOT_UNIQUE: 'השם קיים במערכת יותר מפעם אחת'
	  });
	  $translateProvider.preferredLanguage('HE');
}]);
