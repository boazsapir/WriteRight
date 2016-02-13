'use strict';

/* Filters */

myApp.
filter('interpolate', ['version', function(version) {
  return function(text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  };
}]).filter('displayWordForGame', function(wordHandler){
	return function(word, letterToExclude, solvedLetters, language) {
		var retVal = [];
		if (typeof word != 'undefined' && word != null){
			var letters = wordHandler.letterSeparator(word, language);

			for (var i = 0; i < letters.length; i++) {
				if (letterToExclude == 0){
					if (solvedLetters[i]){
						retVal[i] = letters[i];						
					}
					else{
						retVal[i] = wordHandler.placeHolderChar(language);
					}
				}
				else if (!(i == letterToExclude-1 || (letterToExclude == -1 && i==letters.length-1)) || solvedLetters[i] == true){
					retVal[i] = letters[i];

				}
				else{
					retVal[i] = wordHandler.placeHolderChar(language);
				}
			}
		}
		return retVal;
	};
  });
