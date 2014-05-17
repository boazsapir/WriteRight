'use strict';

/* Filters */

angular.module('myApp.filters', []).
filter('interpolate', ['version', function(version) {
  return function(text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  };
}]).filter('displayWordForGame', function(wordHandler){
	return function(word, letterToExclude) {
		var retVal = new Array();
		if (typeof word != 'undefined'){
			var letters = wordHandler.letterSeparator(word);

			for (var i = 0; i < letters.length; i++) {
				if (!(i == letterToExclude-1 || (letterToExclude == -1 && i==letters.length-1))){
					retVal[i] = letters[i];

				}
				else{
					retVal[i] = wordHandler.placeHolderChar('ar');
				}
			}
		}
		return retVal;
	};
  });
