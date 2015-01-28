'use strict';

/* Controllers */
var myApp = angular.module('myApp.controllers', []);
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
				//$window.alert(rawresp);
				$scope.selectedGameLevel.wordsInLevel.push(resp);
				$scope.$apply();
			});
	};
	$scope.$watch(function(scope){return scope.is_words_backend_ready;},function(newVal, oldVal){
//		$window.alert($scope.is_words_backend_ready);
		if (newVal == true){
			var requestData = {};
			requestData.languageCode = 'HE';
			$scope.selectedWord = null;
			$scope.selectedGameLevel = -1;
			$scope.newDistractors = [];
//			gapi.client.words.getAllGameTaskInstances(requestData).execute(function(resp){
//			$scope.tableRows = resp.items;
//			$scope.$apply();
//			});
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
			gapi.client.request({
				'path': gapiRoot + '/_ah/api/words/v1/get_game_levels',
				'params' : {'gameTypeId' : 2}
			}).execute(function(resp){
				$scope.levelsTableRows = resp.items;
				$scope.selectedGameLevel = resp.items[0];
				$scope.$apply();	
			});
		}
	});	

	  });
myApp.controller('MyCtrl1', function($window, $scope, $q, $filter, wordHandler, ngTableParams) {

	$scope.$watch(function(scope){return scope.is_words_backend_ready;},function(newVal, oldVal){
//		$window.alert($scope.is_words_backend_ready);
//		gapi.client.words.getAllGameTaskInstances(requestData).execute(function(resp){
//		$scope.tableRows = resp.items;
//		$scope.$apply();
//		});

//		$defer.resolve($scope.tableRows);
		if (newVal == true){
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
				$scope.$apply();			
			});
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

myApp.controller('Main', function($window, $scope, $timeout, $http, $q,$translate, wordHandler, audioService, ngDialog) {
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
	$scope.separatedWordSuff = "_sep";

	$scope.apiLoaded = false;
	$scope.userFirstName = null;
	$scope.is_words_backend_ready = false;
	$scope.loggedIn = false;
	$scope.startButtonVisible=true;
	$scope.currentLevel = 0;
//	$scope.firstWord = true;
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
	$scope.duckImage = 'appMonkey';
	$scope.springImage = 'spring1';
	$scope.trampolineImage = 'trampoline1';
	$scope.firstSoundAvailable = false;
	$scope.firstSoundBuffer = null;
	try{
		$scope.audioContext = new AudioContext();		  
	}
	catch(err){
		try{
			$scope.audioContext = new webkitAudioContext();
		}
		catch(err){
			$scope.audioContext = null;
		};
	}
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
		$scope.playWordAudio(false, SoundFileNames.CORRECT_WORD);
		$scope.messageToPlayer = "";
		$scope.solvedWord = $scope.currentWord;
		$scope.score += (Math.max(5 - $scope.mistakesCounter, 2));
		$scope.mistakesCounter = 0;
		$scope.currentWord = "";
		$scope.setFeedbackVisibility(false);
//		$scope.firstWord = false;
//		$scope.distractorCssVar="correctLetterSelection";
		$scope.wordSolved=true;
		$scope.$apply();
		var requestData = {};
		requestData.letterSelections = $scope.wrongLetterSelections;
		requestData.wordInLevelId = $scope.currentWordInLevelId;
		var currentDate = new Date();
		requestData.duration = Math.round((currentDate.getTime() - $scope.wordStartTime)/1000);

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

				if ($scope.currentLevel < $scope.gameLevels.length){

					var displayStartButton = false; 
					//var requestData = {};
					//requestData.gameTypeId = gameTypeId;	
					//requestData.levelIndex = $scope.currentLevel+1;
					gapi.client.request({
						'path': gapiRoot + '/_ah/api/words/v1/get_words_for_level',
						'params' : {'gameTypeId' : gameTypeId, 'levelIndex' : $scope.currentLevel+1 }
					}).execute(function(resp){
					//gapi.client.words.getWordsByLevel(requestData).execute(function(resp) {
						$scope.gameLevels[$scope.currentLevel].wordsInLevel = resp.items;
						if (displayStartButton){
							$scope.startButtonVisible = true;							
							$scope.$apply();		 				
						}
						else{
							// will be displayed after timeout function bellow returns
							displayStartButton = true;
						}
					});
					$scope.scoreCssVar = "";
					$scope.scoreContainerCssVar = "";
					$scope.playAudioFile(SoundFileNames.FINISHED_LEVEL);
					$timeout(function(){
						if (displayStartButton){
							$scope.startButtonVisible = true;
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
				$scope.playWordAudio(false, null, $scope.separatedWordSuff);
			}
		}, 6000);		
	};
	$scope.letterSelected = function(letter, dropTragetLetterIndex){
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
					$scope.wrongLetterSelections.push({index: dropTragetLetterIndex+1, letter: letter});
					$translate("TRY_AGAIN").then(function (translation) {
						$scope.messageToPlayer = translation + " :(";
					});
					$scope.distractorCssVar="wrongLetterSelection";
					$scope.mistakesCounter++;
//					window.alert("Wrong :(");
					$scope.$apply($scope.setFeedbackVisibility(false));
					$scope.distractorCssVar="";
					$scope.playWordAudio(false, SoundFileNames.INCORRECT_LETTER, $scope.separatedWordSuff);
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
			$scope.wrongLetterSelections.push({index: $scope.extractedLetterIndex, letter: letter});
//			$scope.messageToPlayer =  " Try Again :(";
			$translate("TRY_AGAIN").then(function (translation) {
				$scope.messageToPlayer = translation + " :(";
			});
			$scope.distractorCssVar="wrongLetterSelection";
			$scope.mistakesCounter++;
//			window.alert("Wrong :(");
			$scope.$apply($scope.setFeedbackVisibility(false));
			$scope.distractorCssVar="";
			$scope.playWordAudio(false, SoundFileNames.INCORRECT_LETTER, $scope.separatedWordSuff);
			$timeout(function(){
				$scope.setFeedbackVisibility(true);
			    }, 0);

		}

	};
	  $scope.selectNextWord = function(){
		  
		  if ($scope.currentLevel > 0 && $scope.nextWordIndex < $scope.wordsInLevel.length){
			  $scope.currentWord = $scope.wordsInLevel[$scope.nextWordIndex].word.word;
			  $scope.currentWordInLevelId = $scope.wordsInLevel[$scope.nextWordIndex].id;
			  $scope.wordImage = $scope.wordsInLevel[$scope.nextWordIndex].word.imageFileName;
			  $scope.extractedLetterIndex = $scope.gameLevels[$scope.currentLevel-1].letterNumToComplete;
//			  if ($scope.extractedLetterIndex == -1){
//				  $scope.extractedLetterIndex = $scope.currentWord.length;
//			  }
			  $scope.wrongLetterSelections = [];
			  var letters = wordHandler.letterSeparator($scope.currentWord, $scope.language);
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
			  var currentDate = new Date();
			  $scope.wordStartTime = currentDate.getTime();

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
		  $scope.clearDistractors();
		  $scope.updateWordsForLevel();
		  $scope.$apply();
	  };
	  $scope.updateWordsForLevel = function(){
//		  var requestData = {};
//		  requestData.gameTypeId = 1;	
//		  requestData.levelIndex = $scope.currentLevel;

		  $scope.wordsInLevel = $scope.gameLevels[$scope.currentLevel-1].wordsInLevel;
		  $scope.nextWordIndex = 0;
		  $scope.selectNextWord();
//		  if ($scope.currentLevel == 1){
//			  audioService.playFromBuffer($scope.audioContext, $scope.firstWordSoundBuffer);
//		  }
//		  else{
			  $scope.playWordAudio(false, null, $scope.separatedWordSuff);
//		  }
//		  gapi.client.words.getWordsByLevel(requestData).execute(function(resp) {
//		  $scope.wordsInLevel = resp.items;
//		  $scope.nextWordIndex = 0;
//		  $scope.selectNextWord();
//		  $scope.is_words_backend_ready = true;
//		  $scope.$apply();
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
			  var letters =wordHandler.letterSeparator($scope.currentWord, $scope.language);
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
	  
	  $scope.playWordAudio = function(withNext, precedingSound, wordNameSuffix){
		  
		  // function does not support combination of withNext == true AND precedingSound != NULL (concat only two sounds not three)
		  
		  //		var section   = document.getElementsByTagName( "head" )[ 0 ];
		  //		if (typeof $scope.frame != 'undefined'){
		  //			section.removeChild( $scope.frame ); 				   
		  //		};
		  //		$scope.frame  = document.createElement( "iframe" );
		  //		$scope.frame.src = 'audio/' + $scope.wordImage.replace(".jpg", ".mp3");
		  //		section.appendChild( $scope.frame ); 

		  if (withNext && $scope.nextWordIndex < $scope.wordsInLevel.length ){
// This case currently not used, not tested
			  var imageFileSuffix = $scope.wordImage.slice($scope.wordImage.indexOf("."));
			  var word1 = 'audio/' + [$scope.wordImage.slice(0,(-1)*imageFileSuffix.length),
			                          "_", $scope.language, ".mp3"].join('');
			   
			  //var word1 = 'audio/' + $scope.wordImage.replace(".png", ".mp3");
			  //word1 = word1.replace(".jpg", ".mp3");
			  imageFileSuffix = $scope.wordsInLevel[$scope.nextWordIndex].word.imageFileName.slice($scope.wordsInLevel[$scope.nextWordIndex].word.imageFileName.indexOf("."));
		//	  var word2 =	'audio/' +$scope.wordsInLevel[$scope.nextWordIndex].word.imageFileName.replace(".png", ".mp3");
		//	  word2 = word2.replace(".jpg", ".mp3");
			  var word2 = 'audio/' + [$scope.wordsInLevel[$scope.nextWordIndex].word.imageFileName.slice(0,(-1)*imageFileSuffix.length),
			                          "_", $scope.language, ".mp3"].join('');
			  audioService.concatWords($scope.audioContext, word1, word2);
		  }
		  else{
//			  var audio = new Audio();	
//			  audio.src ='audio/' + $scope.wordImage.replace(".jpg", ".mp3");
//			  audio.volume = 1;
//			  audio.play();	
			  var imageFileSuffix = $scope.wordImage.slice($scope.wordImage.indexOf("."));
			  if (wordNameSuffix == 'undefined' || wordNameSuffix == null) wordNameSuffix = "";
			  var word1 = 'audio/' + [$scope.wordImage.slice(0,(-1)*imageFileSuffix.length),
			                          wordNameSuffix, "_", $scope.language, ".mp3"].join('');

//			  word1 ='audio/' + $scope.wordImage.replace(".png", ".mp3");
//			  word1 = word1.replace(".jpg", ".mp3");
			  if(typeof precedingSound != 'undefined' && precedingSound != null){
				  var precedingSoundFilePath = 'audio/' + precedingSound;
				  audioService.concatWords($scope.audioContext, precedingSoundFilePath, word1);				  
			  }
			  else{
				  audioService.concatWords($scope.audioContext, word1, null);
			  }
		  }

	  };
	  
	  $scope.userLogin = function(){
		  audioService.playFromBuffer($scope.audioContext, $scope.firstSoundBuffer);
		  $scope.userNameSubmitted=true;
		  $scope.loginFeedback = "";
		  if ($scope.apiLoaded){
			  $scope.getUserId();
		  }

	  };


	$window.init= function() {
		//$window.alert('111');
		$scope.$apply($scope.getFirstSound);
		$scope.$apply($scope.load_words_lib);
	};
	$scope.load_words_lib = function() {

		gapi.client.load('words', 'v1', function() {
//			$scope.getWords();
//			$scope.currentLanguage = 'EN';
//			$scope.getLanguages();
//			$scope.updateWordsForLanguage();
			//$window.alert("getting data");
			$scope.apiLoaded = true;
			$scope.getGameLevels();
			if($scope.userNameSubmitted){
				$scope.getUserId();
			}
			

		}, 
		gapiRoot + '/_ah/api');

	};
	
	$scope.getFirstSound = function(){
		var firstSoundFile = 'audio/' + 'click.mp3';

		$http.get(firstSoundFile,  {responseType: "arraybuffer"}).success(function(data) {		
			$scope.audioContext.decodeAudioData(data, function(buf1) {
				$scope.firstSoundBuffer = buf1;  
				$scope.firstSoundAvailable = true;
				$scope.$apply();
			});
		});
	};

	$scope.getUserId = function(){
		gapi.client.request({
			'path': gapiRoot + '/_ah/api/words/v1/get_student_by_name/' +  $scope.userFirstName
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
	$scope.getGameLevels = function() {
		var requestData = {};
		requestData.gameTypeId = gameTypeId;	

		// this function omits the word lists except for the first level
			gapi.client.request({
				'path': gapiRoot + '/_ah/api/words/v1/get_game_levels1',
				'params' : {'gameTypeId' : requestData.gameTypeId}
			}).execute(function(resp){
			//gapi.client.words.getGameLevels1(requestData).execute(function(resp) {
			$scope.gameLevels = resp.items;
			//$scope.updateWordsForLevel();	
			$scope.language = $scope.gameLevels[0].gameType.language.languageCode;
			$translate.use($scope.language);
			$scope.is_words_backend_ready = true;
			if($scope.loggedIn){
				$scope.startGame();
			}
			$scope.$apply();			
/*
			var firstWordImageFile = $scope.gameLevels[0].wordsInLevel[0].word.imageFileName;
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
