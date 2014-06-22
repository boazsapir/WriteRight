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
myApp.controller('MyCtrl3', function($scope, $timeout, wordHandler, audioService) {

	$scope.setFeedbackVisibility = function(isVisible){
		$scope.feedbackVisible = isVisible;
	};
	$scope.gameStarted = false;
	$scope.startButtonVisible=true;
	$scope.currentLevel = 0;
	$scope.firstWord = true;
	$scope.wordSolved = false;
	$scope.score = 0;
	$scope.mistakesCounter = 0;
	$scope.duckCssVar = "";
	$scope.trampolineCssVar = "";
	$scope.springCssVar="";
	$scope.scoreCssVar = "";
	$scope.scoreContainerCssVar = "";
	$scope.solvedWord = "";
	$scope.feedbackVisible = false;
	$scope.duckImage = 'duck';
	$scope.springImage = 'spring1';
	$scope.trampolineImage = 'trampoline1';
	$scope.showFirstWord= function(){
		$scope.wordSolved = false;
		$scope.duckCssVar = "";
		$scope.trampolineCssVar = "";
		$scope.springCssVar="";
		$scope.scoreCssVar = "";
		$scope.scoreContainerCssVar = "";
	};
	$scope.handleSolvedWord = function(){
		$scope.duckCssVar = 'jumpDuck';
		$scope.trampolineCssVar = 'jumpTrampoline';
		$scope.springCssVar='jumpSpring';
		$scope.scoreCssVar = 'scoreChange';
		$scope.scoreContainerCssVar = 'scoreContainerBig';
		$scope.duckImage = 'duckHappy';
		$scope.playWordAudio(true);
		$scope.feedbackVisible = false;
		$scope.messageToPlayer = "";
		$scope.solvedWord = $scope.$parent.currentWord;
		$scope.score += (Math.max(5 - $scope.mistakesCounter, 2));
		$scope.mistakesCounter = 0;
		$scope.$parent.currentWord = "";

		$scope.firstWord = false;
//		$scope.distractorCssVar="correctLetterSelection";
		$scope.wordSolved=true;
		$scope.$apply();
		// have to clear currentWord first otherwise ng-repeat with track by index 
		// does not recognize the change of letters and ng-enter not activated

		$timeout(function(){
			// do this only after timeout so the distractors will be animated correctly when set, otherwise they are set while still invisible

			if (!$scope.selectNextWord()){

				if ($scope.currentLevel < $scope.gameLevels.length){
					$scope.startButtonVisible=true;
					$scope.scoreCssVar = "";
					$scope.scoreContainerCssVar = "";
				}
				else{
					$scope.feedbackVisible = true;
					$scope.messageToPlayer = "انتهى!";
				}
			}
			else{

				$scope.wordSolved = false;
				$scope.duckCssVar = "";
				$scope.trampolineCssVar = "";
				$scope.springCssVar="";
				$scope.scoreCssVar = "";
				$scope.scoreContainerCssVar = "";
			}
		}, 2500);		
	};
	$scope.letterSelected = function(letter, dropTragetLetterIndex){
		$scope.messageToPlayer = "";
		$scope.selectedLetter = letter;
		
		if ($scope.extractedLetterIndex == 0){
			if (dropTragetLetterIndex != null){
				var letters = wordHandler.letterSeparator($scope.currentWord);
				if (letters[dropTragetLetterIndex] == letter){
	//				window.alert("YES");
		 			$scope.solvedLetters[dropTragetLetterIndex] = true;
					for (var i=0; i<$scope.currentDistractors.length; i++){
						if($scope.currentDistractors[i] == letter){
							$scope.currentDistractors.splice(i, 1);
							break;
						}
					}
		 			var wordSolved = true;
		 			for (var i=0;i<$scope.solvedLetters.length; i++){
		 				if(!$scope.solvedLetters[i]){
		 					wordSolved = false;
		 					break;
		 				}
		 			}
		 			if (wordSolved){
		 				$scope.handleSolvedWord();
		 			}
		 			else{
						$scope.$apply();		 				
		 			}

				}
				else{

					
					$scope.messageToPlayer = " حاول مرة أخرى :(";
					$scope.distractorCssVar="wrongLetterSelection";
					$scope.mistakesCounter++;
//					window.alert("Wrong :(");
					$scope.$apply($scope.setFeedbackVisibility(false));
					$scope.distractorCssVar="";
					$timeout(function(){
						$scope.feedbackVisible = true;
					    }, 0);

				}
			}
		}

		else if (letter == $scope.extractedLetter){
//			window.alert("Correct :)");


			$scope.handleSolvedWord();
		}
		else{
			$scope.playWordAudio(false);
			$scope.messageToPlayer = " حاول مرة أخرى :(";
			$scope.distractorCssVar="wrongLetterSelection";
			$scope.mistakesCounter++;
//			window.alert("Wrong :(");
			$scope.$apply($scope.setFeedbackVisibility(false));
			$scope.distractorCssVar="";
			$timeout(function(){
				$scope.feedbackVisible = true;
			    }, 0);

		}

	};
	  $scope.selectNextWord = function(){

		  if ($scope.currentLevel > 0 && $scope.nextWordIndex < $scope.wordsInLevel.length){
			  $scope.currentWord = $scope.wordsInLevel[$scope.nextWordIndex].word.word;
			  $scope.wordImage = $scope.wordsInLevel[$scope.nextWordIndex].word.imageFileName;
			  $scope.extractedLetterIndex = $scope.gameLevels[$scope.currentLevel-1].letterNumToComplete;
//			  if ($scope.extractedLetterIndex == -1){
//				  $scope.extractedLetterIndex = $scope.currentWord.length;
//			  }
			  var letters = wordHandler.letterSeparator($scope.currentWord);
//			  $scope.extractedLetter = $scope.currentWord.charAt($scope.extractedLetterIndex-1);
			  if ($scope.extractedLetterIndex == 0){
				  $scope.solvedLetters = [];
				  for (var i=0; i< letters.length; i++){
					  $scope.solvedLetters[i] = false;
				  }
			  }
			  else if ($scope.extractedLetterIndex == -1){
				  $scope.extractedLetter = letters[letters.length-1];	
			  }
			  else{
				  $scope.extractedLetter = letters[$scope.extractedLetterIndex-1];
			  }

//			  if ($scope.extractedLetterIndex < $scope.currentWord.length &&
//			  diacritics.isDiacritic($scope.currentWord.charAt($scope.extractedLetterIndex))){
//			  $scope.extractedLetter += $scope.currentWord.charAt($scope.extractedLetterIndex);
//			  }
//			  $scope.playWordAudio();
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
	$scope.startNextLevel = function(){
		$scope.currentLevel++;
		$scope.startButtonVisible = false;
		$scope.wordSolved = false;
		$scope.duckCssVar = "";
		$scope.trampolineCssVar = "";
		$scope.springCssVar="";
		$scope.scoreCssVar = "";
		$scope.scoreContainerCssVar = "";
		$scope.solvedWord = "";
		$scope.clearDistractors();
		$scope.updateWordsForLevel();
		$scope.gameStarted = true;
		$scope.apply();
	};
	  $scope.updateWordsForLevel = function(){
//		  var requestData = {};
//		  requestData.gameTypeId = 1;	
//		  requestData.levelIndex = $scope.currentLevel;
		  
		  $scope.wordsInLevel = $scope.gameLevels[$scope.currentLevel-1].wordsInLevel;
		  $scope.nextWordIndex = 0;
		  $scope.selectNextWord();
		  if ($scope.currentLevel == 1){
			  audioService.playFromBuffer($scope.audioContext, $scope.firstWordSoundBuffer);
		  }
		  else{
			  $scope.playWordAudio(false);
		  }
//		  gapi.client.words.getWordsByLevel(requestData).execute(function(resp) {
//			  $scope.wordsInLevel = resp.items;
//			  $scope.nextWordIndex = 0;
//			  $scope.selectNextWord();
//			  $scope.is_words_backend_ready = true;
//			  $scope.$apply();
//		  });

	  };
	  $scope.setDistractors = function(){
		  $scope.currentDistractors = $scope.wordsInLevel[$scope.nextWordIndex].distractors;
		  if(typeof $scope.currentDistractors != 'undefined'){
			  if ($scope.extractedLetterIndex != 0){
				  var randomIndex = Math.floor((Math.random()*($scope.currentDistractors.length+1)));
				  $scope.currentDistractors.splice(randomIndex, 0, $scope.extractedLetter);	
			  }
			  else{
				  var letters =wordHandler.letterSeparator($scope.currentWord);
				  for (var i=0;i<letters.length;i++){
					  var randomIndex = Math.floor((Math.random()*($scope.currentDistractors.length+1)));
					  $scope.currentDistractors.splice(randomIndex, 0, letters[i]);	
					  
				  }
			  }
		  }

	  };
	  $scope.clearDistractors = function(){
		  $scope.currentDistractors = {};
	  };
		$scope.playWordAudio = function(withNext){
			//		var section   = document.getElementsByTagName( "head" )[ 0 ];
			//		if (typeof $scope.frame != 'undefined'){
			//			section.removeChild( $scope.frame ); 				   
			//		};
			//		$scope.frame  = document.createElement( "iframe" );
			//		$scope.frame.src = 'audio/' + $scope.wordImage.replace(".jpg", ".mp3");
			//		section.appendChild( $scope.frame ); 

					if (withNext && $scope.nextWordIndex < $scope.wordsInLevel.length ){
						var word1 = 'audio/' + $scope.wordImage.replace(".jpg", ".mp3");
						var word2 =	'audio/' +$scope.wordsInLevel[$scope.nextWordIndex].word.imageFileName.replace(".jpg", ".mp3");
						audioService.concatWords($scope.audioContext, word1, word2);
					}
					else{
//						var audio = new Audio();	
//						audio.src ='audio/' + $scope.wordImage.replace(".jpg", ".mp3");
//						audio.volume = 1;
//						audio.play();	
						word1 ='audio/' + $scope.wordImage.replace(".jpg", ".mp3");
						audioService.concatWords($scope.audioContext, word1, null);
					}
			
				};


});
	myApp.controller('Main', function($window, $scope, $http) {
		$window.init= function() {
			  $scope.$apply($scope.load_words_lib);
		};
	  $scope.load_words_lib = function() {

		  gapi.client.load('words', 'v1', function() {
//			  $scope.getWords();
			  $scope.currentLanguage = 'EN';
			  $scope.getLanguages();
			  $scope.updateWordsForLanguage();
			  $scope.getGameLevels();	




		  }, 
		  gapiRoot + '/_ah/api');

	  };

	  $scope.list = function() {
		  gapi.client.guestbook.guestbook.getAllEntries().execute(function(resp) {
			  $scope.entries = resp.items;
			  $scope.$apply();
		  });
	  };


	  $scope.updateWordsForLanguage = function(){
	        var requestData = {};
	        requestData.languageCode = $scope.currentLanguage;	

		  gapi.client.words.getWordsByLanguage(requestData).execute(function(resp) {
			  $scope.words = resp.items;
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
			  $scope.gameLevels = resp.items;
			  //$scope.updateWordsForLevel();	
			  var firstWordSoundFile = "audio/" + $scope.gameLevels[0].wordsInLevel[0].word.imageFileName.replace(".jpg", ".mp3");

			  $http.get(firstWordSoundFile,  {responseType: "arraybuffer"}).success(function(data) {
//				  var context = null;
				  try{
				  	  $scope.audioContext = new AudioContext();		  
				  }
				  catch(err){
					  try{
						  $scope.audioContext = new webkitAudioContext();
					  }
					  catch(err){
						  
					  };
				  }
				  $scope.audioContext.decodeAudioData(data, function(buf1) {
					  $scope.firstWordSoundBuffer = buf1;  
					  $scope.is_words_backend_ready = true;
					  $scope.$apply();
				  });
			  });

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
