'use strict';

/* Directives */


angular.module('myApp.directives', []).
directive('appVersion', ['version', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}])
.directive('showWord', [function(){
	function link(scope, element, attrs) {
		if (scope.firstWord){
			element.addClass("myTestClass1");
		}
		else{
			element.addClass("myTestClass2");

		}
	}
	return {
		link: link
	};
}]);
