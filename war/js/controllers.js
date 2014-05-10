'use strict';

/* Controllers */
var myApp = angular.module('myApp.controllers', []);
myApp.controller('MyCtrl2', function($scope) {
	  $scope.getEntry = function() {
	        var requestData = {};
	        requestData.id = $scope.selectedId;
			  gapi.client.guestbook.guestbook.getEntry(requestData).execute(function(resp) {
				  $scope.selectedEntry = resp;
				  $scope.$apply();
			  });
		  };
		  $scope.insert= function() {
				 var entry = {
						"message" : $scope.content
				};
				gapi.client.guestbook.greetings.insert(entry).execute(function(resp) {
					$scope.list();
				});

		  };



	  });
myApp.controller('MyCtrl1', function($scope) {

	
	
	  $scope.getLetters = function(word){
        return word.split("");
        
	  };


	  $scope.selectWord = function(){
		  
	  };

});
myApp.controller('MyCtrl3', function($scope, $timeout) {

	$scope.setFeedbackVisibility = function(isVisible){
		$scope.feedbackVisible = isVisible;
	};
	$scope.firstWord = true;
	$scope.wordSolved = false;
	$scope.duckCssVar = "";
	$scope.solvedWord = "";
	$scope.feedbackVisible = false;
	$scope.showFirstWord= function(){
		$scope.wordSolved = false;
		$scope.duckCssVar = "";
	};
	$scope.letterSelected = function(letter){
		$scope.messageToPlayer = "";

		if (letter == $scope.extractedLetter){
//			window.alert("Correct :)");


			$scope.duckCssVar = 'jumpDuck';
			$scope.playWordAudio();
			$scope.feedbackVisible = false;
			$scope.messageToPlayer = "";
			$scope.solvedWord = $scope.$parent.currentWord;
			$scope.$parent.currentWord = "";
			$scope.wordSolved=true;
			$scope.firstWord = false;


			$scope.$apply();
			// have to clear currentWord first otherwise ng-repeat with track by index 
			// does not recognize the change of letters and ng-enter not activated
	
			$timeout(function(){
				// do this only after timeout so the distractors will be animated correctly when set, otherwise they are set while still invisible
				if (!$scope.selectNextWord()){
	
					if ($scope.currentLevel < $scope.gameLevels.length){
						$scope.startButtonVisible=true;
					}
					else{
						$scope.feedbackVisible = true;
						$scope.messageToPlayer = "!انتهى";
					}
				}
				else{

					$scope.wordSolved = false;
					$scope.duckCssVar = "";
				}
			}, 3000);

		}
		else{

			$scope.messageToPlayer = ":( حاول مرة أخرى";
//			window.alert("Wrong :(");
			$scope.$apply($scope.setFeedbackVisibility(false));
			$timeout(function(){
				$scope.feedbackVisible = true;
			    }, 0);

		}

	};
	$scope.startNextLevel = function(){
		$scope.$parent.currentLevel++;
		$scope.startButtonVisible = false;
		$scope.updateWordsForLevel();
		$scope.wordSolved = false;
		$scope.duckCssVar = "";
		$scope.solvedWord = "";
		$scope.clearDistractors();
		$scope.apply();
	};

});
	myApp.controller('Main', function($window, $scope, wordHandler) {
		$scope.playWordAudio = function(){
			var section   = document.getElementsByTagName( "head" )[ 0 ];
			if (typeof $scope.frame != 'undefined'){
				section.removeChild( $scope.frame ); 				   
			};
			$scope.frame  = document.createElement( "iframe" );
			$scope.frame.src = 'https://translate.google.com/translate_tts?ie=utf-8&tl=ar&q=' + $scope.currentWord;
			section.appendChild( $scope.frame ); 
		};
		$window.init= function() {
		  $scope.$apply($scope.load_words_lib);
	  };
	  $scope.load_words_lib = function() {

		  gapi.client.load('words', 'v1', function() {
//			  $scope.getWords();
			  $scope.currentLanguage = 'EN';
			  $scope.currentLevel = 1;
			  $scope.getLanguages();
			  $scope.updateWordsForLanguage();
			  $scope.getGameLevels();	
			  $scope.updateWordsForLevel();	



		  }, 
		  gapiRoot + '/_ah/api');

	  };

	  $scope.list = function() {
		  gapi.client.guestbook.guestbook.getAllEntries().execute(function(resp) {
			  $scope.entries = resp.items;
			  $scope.$apply();
		  });
	  };
	  $scope.selectNextWord = function(){

		  if ($scope.nextWordIndex < $scope.wordsInLevel.length){
			  $scope.currentWord = $scope.wordsInLevel[$scope.nextWordIndex].word.word;
			  $scope.extractedLetterIndex = 1;
			  var letters = wordHandler.letterSeparator($scope.currentWord);
//			  $scope.extractedLetter = $scope.currentWord.charAt($scope.extractedLetterIndex-1);
			  $scope.extractedLetter = letters[$scope.extractedLetterIndex-1];
//			  if ($scope.extractedLetterIndex < $scope.currentWord.length &&
//			  diacritics.isDiacritic($scope.currentWord.charAt($scope.extractedLetterIndex))){
//			  $scope.extractedLetter += $scope.currentWord.charAt($scope.extractedLetterIndex);
//			  }
			  $scope.playWordAudio();
			  $scope.setDistractors();
			  $scope.nextWordIndex++;
		  }
		  else{
			  $scope.currentWord = null;
//			  if ($scope.currentLevel < $scope.gameLevels.length){
//			  $scope.currentLevel++;
//			  $scope.updateWordsForLevel();				
//			  }
//			  else{
			  return false; // no more words = end of game
//			  $scope.$apply();
//			  window.alert("End Of Game");
		  }
//		  }
		  return true;

	  };
	  $scope.setDistractors = function(){
		  $scope.currentDistractors = $scope.wordsInLevel[$scope.nextWordIndex].distractors;
		  if(typeof $scope.currentDistractors != 'undefined'){
			  var randomIndex = Math.floor((Math.random()*($scope.currentDistractors.length+1)));
			  $scope.currentDistractors.splice(randomIndex, 0, $scope.extractedLetter);	
		  }

	  };
	  $scope.clearDistractors = function(){
		  $scope.currentDistractors = {};
	  };
	  $scope.updateWordsForLanguage = function(){
	        var requestData = {};
	        requestData.languageCode = $scope.currentLanguage;	

		  gapi.client.words.getWordsByLanguage(requestData).execute(function(resp) {
			  $scope.words = resp.items;
			  $scope.$apply();
		  });
		  
	  };
	  $scope.updateWordsForLevel = function(){
		  var requestData = {};
		  requestData.gameTypeId = 1;	
		  requestData.levelIndex = $scope.currentLevel;


		  gapi.client.words.getWordsByLevel(requestData).execute(function(resp) {
			  $scope.wordsInLevel = resp.items;
			  $scope.nextWordIndex = 0;
			  $scope.selectNextWord();
			  $scope.is_words_backend_ready = true;
			  $scope.$apply();
		  });

	  };
	  $scope.getWords = function() {
		  gapi.client.words.words.getAllWords().execute(function(resp) {
			  $scope.words = resp.items;
			  $scope.$apply();
		  });
	  };

	  $scope.getGameLevels = function() {
	        var requestData = {};
	        requestData.gameTypeId = 1;	
		  gapi.client.words.getGameLevels(requestData).execute(function(resp) {
			  $scope.gameLevels = resp.value;
			  $scope.$apply();
		  });
	  };
	  $scope.getLanguages = function() {
		  gapi.client.words.words.getAllLanguageCodes().execute(function(resp) {
//			  window.alert(resp.items);
//			  $scope.languages = [];
//			  for (var i = 0; i < resp.items.length; i++) {
//				  $scope.languages.push(resp.items[i].languageCode);
//			  }
//			  $scope.currentLanguage = 'AR';
			  $scope.languages = resp.value;
			  $scope.$apply();
		  });
	  };


});
