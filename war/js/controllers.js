'use strict';

/* Controllers */
//var myApp = angular.module('myApp.controllers', []);
myApp.controller('MyCtrl2', function($scope, $window) {

	$scope.addDistractor = function(){
		$scope.newDistractors.push("");
//		$scope.$apply();
	};
	$scope.addWordToLevel = function(){
//		$window.alert($scope.selectedWord.word + " " + $scope.selectedGameLevel.levelIndex);
		gapi.client.request({
			'path': gapiRoot + '/_ah/api/words/v1/add_word_in_level' +
			 '/' + $scope.selectedGameLevel.id + '/' + $scope.selectedWord.id,
			'params' : {distractors: $scope.newDistractors},
			'method' : 'POST'
			}).execute(function(resp, rawresp){
				if (typeof $scope.selectedGameLevel.wordsInLevel == 'undefined'){
					$scope.selectedGameLevel.wordsInLevel = [];
				}
				$scope.selectedGameLevel.wordsInLevel.push(resp);
				$scope.$apply();
			});
	};
	$scope.selectGame = function(){
		var requestData = {};
		requestData.languageCode = $scope.selectedGameId.language.languageCode;
		gapi.client.request({
			'path': gapiRoot + '/_ah/api/words/v1/get_game_levels',
			'params' : {'gameTypeId': $scope.selectedGameId.id}
		}).execute(function(resp){
			$scope.levelsTableRows = resp.items;
			$scope.selectedGameLevel = resp.items[0];
			$scope.$apply();	
		});
		gapi.client.request({
			'path': gapiRoot + '/_ah/api/words/v1/get_words_by_language',
			'params' : requestData
		}).execute(function(resp){
			$scope.wordsTableRows = resp.items;
			$scope.selectedWord = resp.items[0];
			//var d = new Date(resp.items[15].gameInstance.date);
			//window.alert(d.getTimezoneOffset());
			$scope.$apply();			
		});
	};
	$scope.$watch(function(scope){return scope.is_words_backend_ready;},function(newVal, oldVal){
//		$window.alert($scope.is_words_backend_ready);
		if (newVal == true){
			$scope.selectedWord = null;
			$scope.selectedGameLevel = -1;
			$scope.newDistractors = [];
//			gapi.client.words.getAllGameTaskInstances(requestData).execute(function(resp){
//			$scope.tableRows = resp.items;
//			$scope.$apply();
//			});

			gapi.client.request({
				'path': gapiRoot + '/_ah/api/words/v1/get_game_types',
				'params' : {}
			}).execute(function(resp){
				$scope.typesTableRows = resp.items;
				$scope.selectedGameId = resp.items[0];
				$scope.selectGame();
				$scope.$apply();	
			});
		}
	});	

	  });
myApp.controller('MyCtrl1', function($window, $scope, $q, $filter, wordHandler, ngTableParams) {
	$scope.firstName = '';
	$scope.getReport = function(){
		if ($scope.firstName != ''){
			gapi.client.request({
				'path': gapiRoot + '/_ah/api/words/v1/get_game_task_instances_by_first_name/' + $scope.firstName,
				'params' : {}
			}).execute(function(resp){
				if (resp.items.length > 0){
					$scope.tableParams = new ngTableParams({
						page: 1, 
						count: 10,
						sorting: {
							'gameInstance.date': 'desc'     // initial sorting
						}
					},
					{total: 0, getData: function($defer, params){
						var orderedData = params.sorting() ?
								$filter('orderBy')(resp.items, params.orderBy()) :
									resp.items;
				                params.total(orderedData.length); // set total for recalc pagination
								$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}});
	
					$scope.tableParams.reload();
					$scope.tableParams.count(0);
					$scope.$apply();
					$scope.tableParams.count(25);
					$scope.$apply();
				}
				else{
					$window.alert("no data found for name " + $scope.firstName);
				}
			});
		}else{
			gapi.client.request({
				'path': gapiRoot + '/_ah/api/words/v1/get_all_game_task_instances',
				'params' : {}
			}).execute(function(resp){
				$scope.tableParams = new ngTableParams({
					page: 1, 
					count: 10,
					sorting: {
						'gameInstance.date': 'desc'     // initial sorting
					}
				},
				{total: resp.items.length, getData: function($defer, params){
					var orderedData = params.sorting() ?
							$filter('orderBy')(resp.items, params.orderBy()) :
								resp.items;
							$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}});
				//var d = new Date(resp.items[15].gameInstance.date);
				//window.alert(d.getTimezoneOffset());
				$scope.tableParams.reload();
				$scope.tableParams.count(0);
				$scope.$apply();
				$scope.tableParams.count(25);
				$scope.$apply();			
			});						
		}
	};
	$scope.$watch(function(scope){return scope.is_words_backend_ready;},function(newVal, oldVal){
//		$window.alert($scope.is_words_backend_ready);
//		gapi.client.words.getAllGameTaskInstances(requestData).execute(function(resp){
//		$scope.tableRows = resp.items;
//		$scope.$apply();
//		});

//		$defer.resolve($scope.tableRows);
		if (newVal == true){
			/*

			*/
		}

	});
	$scope.getLetters = function(word){
		return word.split("");

	};

	$scope.letterSeparator = wordHandler.letterSeparator; 





});
myApp.controller('MyCtrl3', function($window, $scope) {	
// Empty because we do everything in Main

});

myApp.controller('Main', function($window, $scope, $timeout, $http, $q,$translate, wordHandler, audioService, ngDialog, languageSettings) {
	var SoundFileNames = {
			CORRECT_LETTER : "CorrectLetter.mp3",
			CORRECT_WORD: "CorrectWord.mp3",
			FINISHED_LEVEL : "FinishedLevel.mp3",
			FINISHED_GAME : "FinishedGame.mp3",
			INCORRECT_LETTER: "IncorrectLetter.mp3"
	};
	var clearDistractors = function(){
		  $scope.currentDistractors = [];
	};	
	function WordForDisplay(word, hideDiacritics, language){
		var wordForDisplay = hideDiacritics?wordHandler.removeDiacritics(word, language):word;
		this.getWord = function(){
			return wordForDisplay;
		
		};
	}
	

	var gameLevels = null;
	var apiLoaded = false;
	//var separatedWordsSubdir = "sep";
	var phonemesSubdir = "phonem";
	var letterNamesSubdir = "letterName";
	var instructionsSubdir = "instructions";
	var firstSoundBuffer = null;
	var audioContext = null;
	try{
		audioContext = new AudioContext();		  
	}
	catch(err){
		try{
			audioContext = new webkitAudioContext();
		}
		catch(err){
			audioContext = null;
		};
	}
	
	var letterSelectedFlag = false;

	$scope.openFeedbackDialog = function(){
			ngDialog.open({ template: 'firstDialogId',  className: 'ngdialog-theme-default', scope: $scope });
	};

	$scope.setFeedbackVisibility = function(isVisible){
		$scope.feedbackVisible = isVisible;
	};
	$scope.langDir = "ltr";
	$scope.userFirstName = null;
	$scope.is_words_backend_ready = false;
	$scope.loggedIn = false;
	$scope.language = null;
	$scope.startButtonVisible=true;
	if ($window.startFromLevel > 0){
		$scope.currentLevel = $window.startFromLevel-1;
	}
	else{
		$scope.currentLevel = 0;		
	}
//	$scope.firstWord = true;
	$scope.wordSolved = false;
	$scope.score = 0;
	$scope.mistakesCounter = 0;
	$scope.duckCssVar = "";
	$scope.trampolineCssVar = "";
	$scope.springCssVar="";
	$scope.scoreCssVar = "";
	$scope.scoreContainerCssVar = "";
	$scope.distractorCssVar = "";
	$scope.letterCssVar = "";
	$scope.feedbackMessageCssVar = "feedbackMessage";
	$scope.solvedWord = "";
	$scope.setFeedbackVisibility(false);
	$scope.duckImage = 'appMonkey';
	$scope.springImage = 'spring1';
	$scope.trampolineImage = 'trampoline1';
	$scope.firstSoundAvailable = false;
	$scope.updatingLevel = true;


	/*
	$scope.showFirstWord= function(){
		$scope.wordSolved = false;
		$scope.duckCssVar = "";
		$scope.trampolineCssVar = "";
		$scope.springCssVar="";
		$scope.scoreCssVar = "";
		$scope.scoreContainerCssVar = "";
	};
	*/
	$scope.handleSolvedWord = function(){
		$scope.duckCssVar = 'jumpDuck';
		$scope.trampolineCssVar = 'jumpTrampoline';
		$scope.springCssVar='jumpSpring';
		$scope.scoreCssVar = 'scoreChange';
		$scope.scoreContainerCssVar = 'scoreContainerBig';
		$scope.duckImage = 'appMonkeyHappy';
		//playWordAudio(false, SoundFileNames.CORRECT_WORD);
		playAudioFile(SoundFileNames.CORRECT_WORD);
		$scope.messageToPlayer = "";
		$scope.solvedWord = $scope.currentWord;
		$scope.score += (Math.max(5 - $scope.mistakesCounter, 2));
		$scope.mistakesCounter = 0;
		$scope.currentWord = "";
		$scope.setFeedbackVisibility(false);
//		$scope.firstWord = false;
		$scope.distractorCssVar="";
		$scope.wordSolved=true;
		clearDistractors();
		var requestData = {};
		requestData.letterSelections = $scope.wrongLetterSelections;
		requestData.wordInLevelId = $scope.currentWordInLevelId;
		var currentDate = new Date();
		requestData.duration = Math.round((currentDate.getTime() - $scope.wordStartTime)/1000);
		requestData.highlightLetters = $window.highlightLetters;
		requestData.pronounceLetters = $window.pronounceLetters;
		requestData.letterNumToComplete = $scope.extractedLetterIndex;
		requestData.gameId = $window.gameTypeId;

		$scope.gameInstanceIdPromise = $scope.gameInstanceIdPromise.then(function(gameInstanceId) {

			requestData.gameInstanceId = gameInstanceId;
	
//			gapi.client.request({
//				'path': gapiRoot + '/_ah/api/words/v1/addGameTaskInstance' +
//				 '/' + requestData.gameInstanceId + '/' + requestData.wordInLevelId + '/' + requestData.duration,
//				'params' : {'letterSelections' : $scope.wrongLetterSelections},
//				'method' : 'POST'			
//			}).execute(function(resp, rawresp){
			if(isProduction){
				gapi.client.words.words.addGameTaskInstance(requestData).execute(function(resp, rawresp) {
	//				window.alert("");
				});
			}
			else{
				gapi.client.request({
				'path': gapiRoot + '/_ah/api/words/v1/addGameTaskInstance' +
				 '/' + requestData.gameInstanceId + '/' + requestData.wordInLevelId + '/' + requestData.duration,
				'params' : {},
				'method' : 'POST'			
				}).execute(function(resp, rawresp){
				
				});
			}

			return gameInstanceId;
		}, function(reason) {
			alert('Failed: ' + reason);
			return reason;
		}, function(update) {
			alert('Got notification: ' + update);
		});


			//window.alert(resp.id);
			//$scope.startNextLevel();  				
		//});		
		// have to clear currentWord first otherwise ng-repeat with track by index 
		// does not recognize the change of letters and ng-enter not activated

		$timeout(function(){
			// do this only after timeout so the distractors will be animated correctly when set, otherwise they are set while still invisible

			if (!$scope.selectNextWord()){

				if ($scope.currentLevel < gameLevels.length){

					var displayStartButton = false; 
					//var requestData = {};
					//requestData.gameTypeId = gameTypeId;	
					//requestData.levelIndex = $scope.currentLevel+1;
					gapi.client.request({
						'path': gapiRoot + '/_ah/api/words/v1/get_words_for_level',
						'params' : {'gameTypeId' : $window.gameTypeId, 'levelIndex' : $scope.currentLevel+1 }
					}).execute(function(resp){
					//gapi.client.words.getWordsByLevel(requestData).execute(function(resp) {
						gameLevels[$scope.currentLevel].wordsInLevel = resp.items;
						if (displayStartButton){
							//$scope.startButtonVisible = true;	
							$scope.startNextLevel();
							$scope.$apply();
						}
						else{
							// will be displayed after timeout function bellow returns
							displayStartButton = true;
						}
					});
					$scope.scoreCssVar = "";
					$scope.scoreContainerCssVar = "";
					playAudioFile(SoundFileNames.FINISHED_LEVEL);
					$timeout(function(){
						if (displayStartButton){
							//$scope.startButtonVisible = true;
							$scope.startNextLevel();
						}
						else{
							// will be displayed when next level data returns from server
							displayStartButton = true;
						}
					}, 5000);
				}
				else{
					$scope.feedbackMessageCssVar = "endOfGameMessage";
					$scope.setFeedbackVisibility(true);
					$translate("END_OF_GAME").then(function (translation) {
						$scope.messageToPlayer = translation;
					});
					playAudioFile(SoundFileNames.FINISHED_GAME);
				}
			}
			else{

				$scope.wordSolved = false;
				$scope.letterCssVar="";
				$scope.duckCssVar = "";
				$scope.trampolineCssVar = "";
				$scope.springCssVar="";
				$scope.scoreCssVar = "";
				$scope.scoreContainerCssVar = "";
				presentNextWord();
			}
		}, 3500);		
	};
	

	var presentNextWord = function(){
		letterSelectedFlag = false;
		var letters = wordHandler.letterSeparator($scope.currentWord, $scope.language);
		var currentLetterIndex = 0;
		var playLetterSound = function myself (delay){
			$scope.$apply($scope.letterCssVar="");
			if (currentLetterIndex < letters.length){
				$timeout(function(){

					if (!letterSelectedFlag){ // stop presentation if letter has been selected while presenting
						if($window.highlightLetters){
							$scope.letterCssVar = "highlightedLetter";
							$scope.highlightedLetter = currentLetterIndex;
						}	
						playAudioFile($scope.language + "/" + phonemesSubdir + "/" + wordHandler.getFileName(letters[currentLetterIndex++], $scope.language) + ".mp3", myself);
					}

				}, delay*1000+500);
			}
		};
		if ($window.pronounceLetters){
			playWordAudio(false, null, "", playLetterSound);
		}
		else{
			playWordAudio(false, null, "");			
		}
	};
	var playCorrectSelectionSounds = function(letter, word, wordCompleted, cb){
		var sequence = [];
		if ($window.pronounceLetters){
			var letterForName = wordHandler.getLetterFromSyllable(letter, $scope.language);
			sequence.push($scope.language + "/" + phonemesSubdir + "/" + wordHandler.getFileName(letter, $scope.language) + ".mp3");
			sequence.push($scope.language + "/" + letterNamesSubdir + "/" + wordHandler.getFileName(letterForName, $scope.language) + ".mp3");
	
		}
		if (wordCompleted || (!$window.pronounceLetters && $scope.extractedLetterIndex == 0)){
			  var imageFileSuffix = $scope.wordImage.slice($scope.wordImage.indexOf("."));
			  var word1 =  [$scope.language, "/", $scope.wordImage.slice(0,(-1)*imageFileSuffix.length),
			                           ".mp3"].join('');
			  sequence.push(word1);
		}
		playAudioSequence(sequence, cb);
		/*
		playAudioFile($scope.language + "/" + letterNamesSubdir + "/" + wordHandler.getFileName(letter[0], $scope.language) + ".mp3", function(delay){
			$timeout(function(){
				playAudioFile($scope.language + "/" + phonemesSubdir + "/" + wordHandler.getFileName(letter[0], $scope.language) + ".mp3", function(delay){
					$timeout(function(){
						if (typeof cb != 'undefined'){
							cb();
						}
					}, delay*1000 + 500);
				});
			}, delay*1000 + 500);
		});
		*/
	};
	var playAudioSequence = function(sequence, cb){
		var currentIndex = 0;
		var subPlayAudioSequence = function myself (delay){

			$timeout(function(){
				if(currentIndex < sequence.length){
					playAudioFile(sequence[currentIndex++], myself);
				}
				else{
					if (typeof cb != 'undefined'){
						cb();
					}				
				}
			}, delay*1000+500);

		};
		subPlayAudioSequence(0);

	};
	$scope.imageClicked = function(){
		playWordAudio(false, null, "");			
	};
	$scope.letterClicked = function(letter){
		var letterForName = wordHandler.getLetterFromSyllable(letter, $scope.language);		
		playAudioFile($scope.language + "/" + letterNamesSubdir + "/" + wordHandler.getFileName(letterForName, $scope.language) + ".mp3");
		
	};
	$scope.letterSelected = function(letter, dropTragetLetterIndex){
		letterSelectedFlag = true;
		$scope.messageToPlayer = "";
		$scope.selectedLetter = letter;
		// patch for Safari bug with Shadda (for some reason the Shadda and other diacritic change their order
		if (letter.length == 3 && letter[2] == "ّ"){
			var newLetter = letter[0] + letter[2] + letter[1];
			letter = newLetter;
		}		
		if ($scope.extractedLetterIndex == 0){
			if (dropTragetLetterIndex != null){
				var letters = wordHandler.letterSeparator($scope.currentWord, $scope.language);
	//			window.alert(letters[dropTragetLetterIndex] + " " +letters[dropTragetLetterIndex].length + " " + letter + " " + letter.length);
	//			for (var i=0; i<letter.length; i++){
	//				if (letters[dropTragetLetterIndex][i] != letter[i]){
	//					window.alert(i + " -  " + letter[i].charCodeAt(0) + " -  " + letters[dropTragetLetterIndex][i].charCodeAt(0) + " -  " + letter);
	//				}
	//			}
				

				if (letters[dropTragetLetterIndex].valueOf() == letter.valueOf()
					|| letter.length == 1 && letters[dropTragetLetterIndex][0].valueOf() == letter.valueOf()){
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
					/*
		 			var wordSolved = true;
		 			for (var i=0;i<$scope.solvedLetters.length; i++){
		 				if(!$scope.solvedLetters[i]){
		 					wordSolved = false;
		 					break;
		 				}
		 			}
		 			*/
		 			if (++$scope.currentLetterToComplete >= $scope.solvedLetters.length){
		 				playCorrectSelectionSounds(letters[dropTragetLetterIndex], $scope.currentWord, true, $scope.handleSolvedWord);		 				
		 			}
		 			else{
		 				//playAudioFile(SoundFileNames.CORRECT_LETTER);
		 				playCorrectSelectionSounds(letters[dropTragetLetterIndex], $scope.currentWord, false);
						$scope.$apply();		 				
		 			}

				}
				else{
					ga('send', 'event', 'dragWrongLetter', 'L'+$scope.currentLevel +' ' +$scope.currentWord +'-' + dropTragetLetterIndex, letter);									
					$scope.wrongLetterSelections.push({index: dropTragetLetterIndex+1, letter: letter});
					$translate("TRY_AGAIN").then(function (translation) {
						$scope.messageToPlayer = translation + " :(";
					});
					$scope.distractorCssVar="wrongLetterSelection";
					$scope.mistakesCounter++;
//					window.alert("Wrong :(");
					$scope.$apply($scope.setFeedbackVisibility(false));
					$scope.distractorCssVar="";
					//playWordAudio(false, SoundFileNames.INCORRECT_LETTER, separatedWordsSubdir);
					var letterForName = wordHandler.getLetterFromSyllable(letter, $scope.language);		
					var letterNameAudioFile = $scope.language + "/" + letterNamesSubdir + "/" + wordHandler.getFileName(letterForName, $scope.language) + ".mp3";

					playAudioFile(letterNameAudioFile, function(delay){
						$timeout(function(){
							presentNextWord();
						}, delay*1000);
					});

					$timeout(function(){
						$scope.setFeedbackVisibility(true);
						    }, 0);

				}
			}
		}

		else if (letter == $scope.extractedLetter
				|| letter.length == 1 && letter == $scope.extractedLetter[0]){
//			window.alert("Correct :)");
//			ga('send', 'event', 'button', 'selectCorrectLetter', 'letter'+letter.charCodeAt(0));
			ga('send', 'event', 'dragCorrectLetter', 'L'+$scope.currentLevel +' ' +$scope.currentWord, letter);
//			ga('send', 'event', 'button', 'click', 'selectLetter'+$scope.currentLevel);
 			$scope.$apply($scope.solvedLetters[$scope.currentLetterToComplete] = true);
			playCorrectSelectionSounds($scope.extractedLetter, $scope.currentWord, true, $scope.handleSolvedWord);
		}
		else{
			ga('send', 'event', 'dragWrongLetter', 'L'+$scope.currentLevel +' ' +$scope.currentWord, letter);
			$scope.wrongLetterSelections.push({index: $scope.currentLetterToComplete+1, letter: letter});
//			$scope.messageToPlayer =  " Try Again :(";
			$translate("TRY_AGAIN").then(function (translation) {
				$scope.messageToPlayer = translation + " :(";
			});
			$scope.distractorCssVar="wrongLetterSelection";
			$scope.mistakesCounter++;
//			window.alert("Wrong :(");
			$scope.$apply($scope.setFeedbackVisibility(false));
			$scope.distractorCssVar="";
			//playWordAudio(false, SoundFileNames.INCORRECT_LETTER, separatedWordsSubdir);
			var letterForName = wordHandler.getLetterFromSyllable(letter, $scope.language);		
			var letterNameAudioFile = $scope.language + "/" + letterNamesSubdir + "/" + wordHandler.getFileName(letterForName, $scope.language) + ".mp3";
			playAudioFile(letterNameAudioFile, function(delay){
				$timeout(function(){
					presentNextWord();
				}, delay*1000);
			});

			$timeout(function(){
				$scope.setFeedbackVisibility(true);
			    }, 0);

		}

	};
	  $scope.selectNextWord = function(){
		  
		  if ($scope.currentLevel > 0 && $scope.nextWordIndex < $scope.wordsInLevel.length){
			  $scope.currentWord = new WordForDisplay($scope.wordsInLevel[$scope.nextWordIndex].word.word, $window.hideDiacritics, $scope.language).getWord();
			//  $scope.currentWord = $scope.wordsInLevel[$scope.nextWordIndex].word.word;
			  $scope.currentWordInLevelId = $scope.wordsInLevel[$scope.nextWordIndex].id;
			  $scope.wordImage = $scope.wordsInLevel[$scope.nextWordIndex].word.imageFileName;
			  for (var ind=0; ind< gameLevels.length;ind++){
				  if (gameLevels[ind].levelIndex == $scope.currentLevel){
					  $scope.extractedLetterIndex = gameLevels[ind].letterNumToComplete;
					  break;
				  }
			  }
			  //$scope.extractedLetterIndex = gameLevels[$scope.currentLevel-1].letterNumToComplete;
						  
//			  if ($scope.extractedLetterIndex == -1){
//				  $scope.extractedLetterIndex = $scope.currentWord.length;
//			  }
			  $scope.wrongLetterSelections = [];
			  var letters = wordHandler.letterSeparator($scope.currentWord, $scope.language);
			  $scope.currentLetterToComplete =
				  $scope.extractedLetterIndex == 0 ? 0 : $scope.extractedLetterIndex == -1 ? letters.length-1 : $scope.extractedLetterIndex - 1;

//			  $scope.extractedLetter = $scope.currentWord.charAt($scope.extractedLetterIndex-1);

			  $scope.solvedLetters = [];
			  for (var i=0; i< letters.length; i++){
				  $scope.solvedLetters[i] = false;
			  }
			  if ($scope.extractedLetterIndex != 0){
				  $scope.extractedLetter = letters[$scope.currentLetterToComplete];
			  }


//			  if ($scope.extractedLetterIndex < $scope.currentWord.length &&
//			  diacritics.isDiacritic($scope.currentWord.charAt($scope.extractedLetterIndex))){
//			  $scope.extractedLetter += $scope.currentWord.charAt($scope.extractedLetterIndex);
//			  }
//			  $scope.playWordAudio();
			  setDistractors();
			  $scope.nextWordIndex++;
			  var currentDate = new Date();
			  $scope.wordStartTime = currentDate.getTime();

		  }
		  else{
			  $scope.currentWord = "";
//			  if ($scope.currentLevel < gameLevels.length){
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
	  
	  $scope.startGame = function(){
	
			var deferred = $q.defer();
			gapi.client.request({
				'path': gapiRoot + '/_ah/api/words/v1/newGameInstance' +
				'/' + $scope.userId,
				'method': 'POST'
			}).execute(function(resp){
//			gapi.client.words.words.newGameInstance(requestData).execute(function(resp) {
				//window.alert(resp.id);
				deferred.resolve(resp.id);
			});
			$scope.gameInstanceIdPromise = deferred.promise; 
			$scope.startNextLevel();  				
	  };

	  $scope.startNextLevel = function(){
		  $scope.currentLevel++;
		  ga('send', 'event', 'button', 'click', 'startLevel'+$scope.currentLevel);
		  /*
		  var game_key = 'd3f23bd4ad5ab9e949f7786a060e934d';                                  
			  var secret_key = 'cd3bdb7e8ca6876c13559e39c314878178d3d4f4';
			  var category = "design";
			   
			  var message = {
					  		event_id:'StartLevel',
			  			   user_id:'randomUser1',
			  			   session_id:'session_2',
			  			   build:'1.0a',
			  			   value: $scope.currentLevel,
			  			   area: 'Level' + $scope.currentLevel
			  			   };
			   
			  var json_message = JSON.stringify(message); 
			  var md5_msg = CryptoJS.MD5(json_message + secret_key); 
			  var header_auth_hex = CryptoJS.enc.Hex.stringify(md5_msg); 
			   
			  var gameanalyticsUrl = 'http://api-eu.gameanalytics.com/1/'+game_key+'/'+category;
				$http({
					method: 'POST',
					url: gameanalyticsUrl,
					data: json_message, 
					headers: {"Content-Type": 'text/plain',
						"Authorization": header_auth_hex }
				}).success(function(data){

				})
				.error(function(data){
				});
				*/		

		  $scope.startButtonVisible = false;
		  $scope.wordSolved = false;
		  $scope.duckCssVar = "";
		  $scope.trampolineCssVar = "";
		  $scope.springCssVar="";
		  $scope.scoreCssVar = "";
		  $scope.scoreContainerCssVar = "";
		  $scope.solvedWord = "";
		  clearDistractors();
		  updateWordsForLevel();
	  };
	  var updateWordsForLevel = function(){
//		  var requestData = {};
//		  requestData.gameTypeId = 1;	
//		  requestData.levelIndex = $scope.currentLevel;
		  $scope.updatingLevel = true;
		  $scope.wordsInLevel = gameLevels[$scope.currentLevel-1].wordsInLevel;
		  $scope.nextWordIndex = 0;
		  $scope.selectNextWord();
		  playAudioFile($scope.language + "/" + instructionsSubdir + "/" + $scope.extractedLetterIndex + ".mp3", function(delay){
			  $timeout(function(){
				  $scope.updatingLevel = false;				  
				  presentNextWord();
			  }, delay*1000);
		  });

//		  if ($scope.currentLevel == 1){
//			  audioService.playFromBuffer($scope.audioContext, $scope.firstWordSoundBuffer);
//		  }
//		  else{

			//  presentNextWord();
//		  }
//		  gapi.client.words.getWordsByLevel(requestData).execute(function(resp) {
//		  $scope.wordsInLevel = resp.items;
//		  $scope.nextWordIndex = 0;
//		  $scope.selectNextWord();
//		  $scope.is_words_backend_ready = true;
//		  $scope.$apply();
//		  });

	  };
	  var setDistractors = function(){
		  clearDistractors();
		  var withDiacritics = false;
		  var rawDistractors = $scope.wordsInLevel[$scope.nextWordIndex].distractors;
		  if (rawDistractors != undefined){
			  
			  rawDistractors.forEach(function(element, index, array){
				  //if (element.length > 1){
					//  withDiacritics = true;
				  //}
				  $scope.currentDistractors.push(new WordForDisplay(element, $window.hideDiacritics, $scope.language).getWord());
			  });
		  }
		  //$scope.currentDistractors = $scope.wordsInLevel[$scope.nextWordIndex].distractors;

		  if ($scope.extractedLetterIndex != 0){
			  var letterToInsert = (withDiacritics?$scope.extractedLetter:$scope.extractedLetter[0]);
			  var randomIndex = Math.floor((Math.random()*($scope.currentDistractors.length+1)));
			  $scope.currentDistractors.splice(randomIndex, 0, letterToInsert);	
		  }
		  else{
			  var letters =wordHandler.letterSeparator($scope.currentWord, $scope.language);
			  for (var i=0;i<letters.length;i++){
				  var letterToInsert = (withDiacritics?letters[i]:letters[i][0]);
				  var randomIndex = Math.floor((Math.random()*($scope.currentDistractors.length+1)));
				  $scope.currentDistractors.splice(randomIndex, 0, letterToInsert);	

			  }
		  }

	  };


	  var playAudioFile = function(fileName, cb){
		  var filePath = 'audio/' + fileName;
		  audioService.concatWords(audioContext, filePath, null, cb);
	  };

	  var playWordAudio = function(withNext, precedingSound, subDir, cb){
		  
		  // function does not support combination of withNext == true AND precedingSound != NULL (concat only two sounds not three)
		  
		  //		var section   = document.getElementsByTagName( "head" )[ 0 ];
		  //		if (typeof $scope.frame != 'undefined'){
		  //			section.removeChild( $scope.frame ); 				   
		  //		};
		  //		$scope.frame  = document.createElement( "iframe" );
		  //		$scope.frame.src = 'audio/' + $scope.wordImage.replace(".jpg", ".mp3");
		  //		section.appendChild( $scope.frame ); 
/*
		  if (withNext && $scope.nextWordIndex < $scope.wordsInLevel.length ){
// This case currently not used, not tested
			  var imageFileSuffix = $scope.wordImage.slice($scope.wordImage.indexOf("."));
			  var word1 = 'audio/' + [$scope.language, "/", $scope.wordImage.slice(0,(-1)*imageFileSuffix.length)
			                         , ".mp3"].join('');
			   
			  //var word1 = 'audio/' + $scope.wordImage.replace(".png", ".mp3");
			  //word1 = word1.replace(".jpg", ".mp3");
			  imageFileSuffix = $scope.wordsInLevel[$scope.nextWordIndex].word.imageFileName.slice($scope.wordsInLevel[$scope.nextWordIndex].word.imageFileName.indexOf("."));
		//	  var word2 =	'audio/' +$scope.wordsInLevel[$scope.nextWordIndex].word.imageFileName.replace(".png", ".mp3");
		//	  word2 = word2.replace(".jpg", ".mp3");
			  var word2 = 'audio/' + [$scope.language, "/", $scope.wordsInLevel[$scope.nextWordIndex].word.imageFileName.slice(0,(-1)*imageFileSuffix.length)
			                          , ".mp3"].join('');
			  audioService.concatWords(audioContext, word1, word2, cb);
		  }
		  else{
*/		  
//			  var audio = new Audio();	
//			  audio.src ='audio/' + $scope.wordImage.replace(".jpg", ".mp3");
//			  audio.volume = 1;
//			  audio.play();	
			  var imageFileSuffix = $scope.wordImage.slice($scope.wordImage.indexOf("."));
			  if (typeof subDir == 'undefined' || subDir == null){
				  subDir = "";
			  }
			  else if (subDir != ""){
				  subDir = subDir + "/";
			  }
			  var word1 = 'audio/' + [$scope.language, "/", subDir, $scope.wordImage.slice(0,(-1)*imageFileSuffix.length),
			                           ".mp3"].join('');

//			  word1 ='audio/' + $scope.wordImage.replace(".png", ".mp3");
//			  word1 = word1.replace(".jpg", ".mp3");
			  if(typeof precedingSound != 'undefined' && precedingSound != null){
				  var precedingSoundFilePath = 'audio/' + precedingSound;
				  audioService.concatWords(audioContext, precedingSoundFilePath, word1, cb);				  
			  }
			  else{
				  audioService.concatWords(audioContext, word1, null, cb);
			  }
		 // }

	  };
	  
	  $scope.userLogin = function(){
		  audioService.playFromBuffer(audioContext, firstSoundBuffer);
		  $scope.userNameSubmitted=true;
		  $scope.loginFeedback = "";
		  if (apiLoaded){
			  getUserId();
		  }

	  };
	  var load_words_lib = function() {

		  gapi.client.load('words', 'v1', function() {
//			  $scope.getWords();
//			  $scope.currentLanguage = 'EN';
//			  $scope.getLanguages();
//			  $scope.updateWordsForLanguage();
			  //$window.alert("getting data");
			  apiLoaded = true;
			  getGameLevels();
			  if($scope.userNameSubmitted){
				  getUserId();
			  }

			  
		  }, 
		  gapiRoot + '/_ah/api');

	  };
	  
	  var getFirstSound = function(){
		  var firstSoundFile = 'audio/' + 'click.mp3';

		  $http.get(firstSoundFile,  {responseType: "arraybuffer"}).success(function(data) {		
			  audioContext.decodeAudioData(data, function(buf1) {
				  firstSoundBuffer = buf1;  
				  $scope.firstSoundAvailable = true;
				  $scope.$apply();
			  });
		  });
	  };

	$window.init= function() {
		//$window.alert('111');
		$scope.$apply(getFirstSound);
		$scope.$apply(load_words_lib);
	};

	

	var getUserId = function(){
		gapi.client.request({
			'path': gapiRoot + '/_ah/api/words/v1/login_by_name/' +  $scope.userFirstName
		}).then(function(resp){
			$scope.userId = resp.result.id;
			$scope.loggedIn=true;
			if($scope.is_words_backend_ready){
				$scope.startGame();
			}
			$scope.$apply();
		},function(reason){
			$scope.userNameSubmitted=false;
			//window.alert(reason.result.error.message);
			$scope.loginFeedback = reason.result.error.message;
			$scope.$apply();
		});
	};
	/*
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
*/
	var getGameLevels = function() {
		var requestData = {};
		requestData.gameTypeId = $window.gameTypeId;	

			var funcToCall;
			if ($window.startFromLevel > 1){
				funcToCall = '/_ah/api/words/v1/get_game_levels';
			}
			else{
				// this function omits the word lists except for the first level
				funcToCall = '/_ah/api/words/v1/get_game_levels1';				
			}

			gapi.client.request({
				'path': gapiRoot + funcToCall,
				'params' : {'gameTypeId' : requestData.gameTypeId}
			}).execute(function(resp){
			//gapi.client.words.getGameLevels1(requestData).execute(function(resp) {
			gameLevels = resp.items;
			//$scope.updateWordsForLevel();	
			$scope.language = gameLevels[0].gameType.language.languageCode;
			$translate.use($scope.language);
			$scope.langDir = languageSettings.direction($scope.language);
			$scope.is_words_backend_ready = true;
			if($scope.loggedIn){
				$scope.startGame();
			}
			$scope.$apply();			
/*
			var firstWordImageFile = gameLevels[0].wordsInLevel[0].word.imageFileName;
			var imageFileSuffix = firstWordImageFile.slice(firstWordImageFile.indexOf("."));

			//var firstWordSoundFile = "audio/" + firstWordImageFile.replace(".png", ".mp3");
			var firstWordSoundFile = 'audio/' + [firstWordImageFile.slice(0,(-1)*imageFileSuffix.length),
			                          $scope.separatedWordSuff, "_", $scope.language, ".mp3"].join('');

			$http.get(firstWordSoundFile,  {responseType: "arraybuffer"}).success(function(data) {
//				var context = null;

				$scope.audioContext.decodeAudioData(data, function(buf1) {
					$scope.firstWordSoundBuffer = buf1;  
					$scope.is_words_backend_ready = true;
					deferred.resolve();
					if($scope.loggedIn){
						$scope.startGame();
					}
					$scope.$apply();
				});
			});
*/			

		});
	};
	
/*
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
*/

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
