'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.2').
  service('diacritics', function() {

	  this.isDiacritic = function(letter){
		  var code = letter.charCodeAt(0);
		  if (code >= 1612 && code <= 1631){
			  return true;
		  }
		  return false;
	  };
  }).service('wordHandler',function(diacritics){
	  this.letterSeparator = function(word){
		  var letters = word.split("");
		  var retVal = new Array();
		  for (var i = 0, j = 0; i < letters.length; i++, j++) {
			  retVal[j] = letters[i];
			  if (i<letters.length-1 && diacritics.isDiacritic(letters[i+1])){
				  retVal[j] += letters[++i];
			  }
		  }
		  return retVal;
	  };
  });
 