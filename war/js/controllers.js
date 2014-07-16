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
myApp.controller('MyCtrl3', function($scope, $timeout, wordHandler, audioService, ngDialog) {
	var SoundFileNames = {
			CORRECT_LETTER : "CorrectLetter.mp3",
			CORRECT_WORD: "CorrectWord.mp3",
			FINISHED_LEVEL : "FinishedLevel.mp3",
			FINISHED_GAME : "FinishedGame.mp3",
			INCORRECT_LETTER: "IncorrectLetter.mp3"
	};
	
	$scope.openFeedbackDialog = function(){
			ngDialog.open({ template: 'firstDialogId',  className: 'ngdialog-theme-default', scope: $scope });
	};

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
	$scope.feedbackMessageCssVar = "feedbackMessage";
	$scope.solvedWord = "";
	$scope.setFeedbackVisibility(false);
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
		$scope.playWordAudio(false, SoundFileNames.CORRECT_WORD);
		$scope.messageToPlayer = "";
		$scope.solvedWord = $scope.currentWord;
		$scope.score += (Math.max(5 - $scope.mistakesCounter, 2));
		$scope.mistakesCounter = 0;
		$scope.currentWord = "";
		$scope.setFeedbackVisibility(false);
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
					
					$scope.scoreCssVar = "";
					$scope.scoreContainerCssVar = "";
					$scope.playAudioFile(SoundFileNames.FINISHED_LEVEL);
					$timeout(function(){$scope.startButtonVisible=true;}, 5000);
				}
				else{
					$scope.feedbackMessageCssVar = "endOfGameMessage";
					$scope.setFeedbackVisibility(true);
					$scope.messageToPlayer = "Game Ended!";
					$scope.playAudioFile(SoundFileNames.FINISHED_GAME);
				}
			}
			else{

				$scope.wordSolved = false;
				$scope.duckCssVar = "";
				$scope.trampolineCssVar = "";
				$scope.springCssVar="";
				$scope.scoreCssVar = "";
				$scope.scoreContainerCssVar = "";
				$scope.playWordAudio(false);
			}
		}, 6000);		
	};
	$scope.letterSelected = function(letter, dropTragetLetterIndex){
		$scope.messageToPlayer = "";
		$scope.selectedLetter = letter;
		// patch for Safari bug with Shadda (for some reason the Shadda and other discritic change their order
		if (letter.length == 3 && letter[2] == "ّ"){
			var newLetter = letter[0] + letter[2] + letter[1];
			letter = newLetter;
		}		
		if ($scope.extractedLetterIndex == 0){
			if (dropTragetLetterIndex != null){
				var letters = wordHandler.letterSeparator($scope.currentWord);
	//			window.alert(letters[dropTragetLetterIndex] + " " +letters[dropTragetLetterIndex].length + " " + letter + " " + letter.length);
	//			for (var i=0; i<letter.length; i++){
	//				if (letters[dropTragetLetterIndex][i] != letter[i]){
	//					window.alert(i + " -  " + letter[i].charCodeAt(0) + " -  " + letters[dropTragetLetterIndex][i].charCodeAt(0) + " -  " + letter);
	//				}
	//			}
				

				if (letters[dropTragetLetterIndex].valueOf() == letter.valueOf()){
	//				window.alert("YES");
					ga('send', 'event', 'dragCorrectLetter', 'L'+$scope.currentLevel +' ' +$scope.currentWord +'-' + dropTragetLetterIndex, letter);
//					ga('send', 'event', 'button', 'click', 'startLevel'+$scope.currentLevel);

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
		 				$scope.playAudioFile(SoundFileNames.CORRECT_LETTER);
						$scope.$apply();		 				
		 			}

				}
				else{
					ga('send', 'event', 'dragWrongLetter', 'L'+$scope.currentLevel +' ' +$scope.currentWord +'-' + dropTragetLetterIndex, letter);									
					$scope.messageToPlayer = " Try Again :(";
					$scope.distractorCssVar="wrongLetterSelection";
					$scope.mistakesCounter++;
//					window.alert("Wrong :(");
					$scope.$apply($scope.setFeedbackVisibility(false));
					$scope.distractorCssVar="";
					$scope.playWordAudio(false, SoundFileNames.INCORRECT_LETTER);
					$timeout(function(){
						$scope.setFeedbackVisibility(true);
					    }, 0);

				}
			}
		}

		else if (letter == $scope.extractedLetter){
//			window.alert("Correct :)");
//			ga('send', 'event', 'button', 'selectCorrectLetter', 'letter'+letter.charCodeAt(0));
			ga('send', 'event', 'dragCorrectLetter', 'L'+$scope.currentLevel +' ' +$scope.currentWord, letter);
//			ga('send', 'event', 'button', 'click', 'selectLetter'+$scope.currentLevel);

			$scope.handleSolvedWord();
		}
		else{
			ga('send', 'event', 'dragWrongLetter', 'L'+$scope.currentLevel +' ' +$scope.currentWord, letter);
			$scope.messageToPlayer =  " Try Again :(";
			$scope.distractorCssVar="wrongLetterSelection";
			$scope.mistakesCounter++;
//			window.alert("Wrong :(");
			$scope.$apply($scope.setFeedbackVisibility(false));
			$scope.distractorCssVar="";
			$scope.playWordAudio(false, SoundFileNames.INCORRECT_LETTER);
			$timeout(function(){
				$scope.setFeedbackVisibility(true);
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
		ga('send', 'event', 'button', 'click', 'startLevel'+$scope.currentLevel);
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
		  if (typeof $scope.currentDistractors == 'undefined'){
			  $scope.currentDistractors = [];
		  }
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

	  };
	  $scope.clearDistractors = function(){
		  $scope.currentDistractors = {};
	  };
	  
	  $scope.playAudioFile = function(fileName){
		  var filePath = 'audio/' + fileName;
		  audioService.concatWords($scope.audioContext, filePath, null);	  };
	  
	  $scope.playWordAudio = function(withNext, precedingSound){
		  
		  // function does not support combination of withNext == true AND precedingSound != NULL (concat only two sounds not three)
		  
		  //		var section   = document.getElementsByTagName( "head" )[ 0 ];
		  //		if (typeof $scope.frame != 'undefined'){
		  //			section.removeChild( $scope.frame ); 				   
		  //		};
		  //		$scope.frame  = document.createElement( "iframe" );
		  //		$scope.frame.src = 'audio/' + $scope.wordImage.replace(".jpg", ".mp3");
		  //		section.appendChild( $scope.frame ); 

		  if (withNext && $scope.nextWordIndex < $scope.wordsInLevel.length ){
			  var word1 = 'audio/' + $scope.wordImage.replace(".png", ".mp3");
			  word1 = word1.replace(".jpg", ".mp3");
			  var word2 =	'audio/' +$scope.wordsInLevel[$scope.nextWordIndex].word.imageFileName.replace(".png", ".mp3");
			  word2 = word2.replace(".jpg", ".mp3");
			  audioService.concatWords($scope.audioContext, word1, word2);
		  }
		  else{
//			  var audio = new Audio();	
//			  audio.src ='audio/' + $scope.wordImage.replace(".jpg", ".mp3");
//			  audio.volume = 1;
//			  audio.play();	
			  word1 ='audio/' + $scope.wordImage.replace(".png", ".mp3");
			  word1 = word1.replace(".jpg", ".mp3");
			  if(typeof precedingSound != 'undefined' && precedingSound != null){
				  var precedingSoundFilePath = 'audio/' + precedingSound;
				  audioService.concatWords($scope.audioContext, precedingSoundFilePath, word1);				  
			  }
			  else{
				  audioService.concatWords($scope.audioContext, word1, null);
			  }
		  }

	  };


});
myApp.controller('Main', function($window, $scope, $http) {

	$window.init= function() {
		$scope.$apply($scope.load_words_lib);
	};
	$scope.load_words_lib = function() {

		gapi.client.load('words', 'v1', function() {
//			$scope.getWords();
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
			var firstWordSoundFile = "audio/" + $scope.gameLevels[0].wordsInLevel[0].word.imageFileName.replace(".png", ".mp3");

			$http.get(firstWordSoundFile,  {responseType: "arraybuffer"}).success(function(data) {
//				var context = null;
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
//			window.alert(resp.items);
//			$scope.languages = [];
//			for (var i = 0; i < resp.items.length; i++) {
//			$scope.languages.push(resp.items[i].languageCode);
//			}
//			$scope.currentLanguage = 'AR';
			$scope.languages = resp.value;
			$scope.$apply();
		});
	};


});
myApp.controller('FeedbackForm', function($window, $scope, $http, $timeout) {
	$scope.feedbackSubmitted = false;
	$scope.feedbackSubmissionFalied = false;

	$scope.sendUserFeedback = function(){
		$scope.userInputError = false;
		$http({
			method: 'POST',
			url: '/sendfeedback',
			data: "message=" + $scope.userMessage +"&name=" + $scope.userName + "&email=" + $scope.userEmail,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data){
			$scope.feedbackSubmitted = true;
			$timeout(function(){$scope.$parent.closeThisDialog();}, 1000);

		})
		.error(function(data){
			$scope.feedbackSubmissionFailed = true;
		});

	};

});
