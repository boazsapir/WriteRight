'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
myApp.
  value('version', '0.2').
  service('languageSettings', function(){
	 this.direction = function(language){
		  switch(language){
		  case 'HE':
		  case 'AR':
			  return "rtl";
		  default:	
			  return "ltr";
		  }		 
	 };
  }).service('diacritics', function() {

	  this.isDiacritic = function(letter, language){
		  var code = letter.charCodeAt(0);
		  switch(language){
		  case 'AR':
			  if ((code >= 1612 && code <= 1631) || code == 1575){
				  return true;
			  }
			  break;
		  case 'HE':
			  if(code>=0x5B0 && code<=0x5c2){
				  return true;
			  }
			  break;
		  default:	
			  break;
		  }
		  

		  return false;
	  };
	  this.isOptionalDiacritic = function(letter, language){
		  var code = letter.charCodeAt(0);
		  switch(language){
		  case 'AR':
			  if (code >= 1612 && code <= 1631){
				  return true;
			  }
			  break;

		  default:
			  if (this.isDiacritic(letter, language)){
				  return true;
			  }
			  break;
		  }
		  

		  return false;
	  };
  }).service('wordHandler',function(diacritics){
	  this.letterSeparator = function(word, language){
		  var letters = word.split("");
		  var retVal = [];
		  for (var i = 0, j = 0; i < letters.length; i++) {
			  var curLetter = letters[i];
			  //retVal[j] = letters[i];
			  if (i<letters.length-1 && diacritics.isDiacritic(letters[i+1],language)){
				  curLetter += letters[++i];
				  if (i<letters.length-1 && diacritics.isDiacritic(letters[i+1],language)){
					  curLetter += letters[++i]; // case of 2 diacritics for one letter (e.g. shadda) 
				  }
			  }
			  retVal.push(curLetter);
		  }
		  return retVal;
	  };
	  this.placeHolderChar = function(language){
		  if (language.toUpperCase() == 'AR'){
			  return "ـــ"; // it looks the same but it is not
		  }
		  else{
			  return "_"; // it looks the same but it is not
		  }
	  };
	  this.removeDiacritics = function(word, language){
		  var letters = word.split("");
		  var retVal = "";
		  for (var i = 0, j = 0; i < letters.length; i++) {
			  if(!diacritics.isOptionalDiacritic(letters[i], language)){
				  retVal+= letters[i];
			  }
		  }
		  return retVal.toString();
	  };
	  // convert word/letter/syllable string to ascii representation because of problem with deploying files with utf-8 names (e.g. Hebrew name)
	  this.getFileName = function(word, language){
		  switch(language){
		  case 'EN':
			  return word;
		  case 'HE':
		  case 'AR':
			  var retVal = "";
			  for (var i=0; i< word.length; i++){
				  var code = word.charCodeAt(i);
				  if (i != 0) retVal += "_";
				  retVal += code.toString(16).toUpperCase();
			  }
			  return retVal;
		  default: 
			  return word;

		  } 
	  };
	  this.getLetterFromSyllable = function(syllable, language){
			switch(language){
			case 'HE':
				var letterCode = syllable.charCodeAt(0);
				if (syllable.length > 1 && syllable.charCodeAt(1) == 0x5BC){
					if(letterCode == 0x5D1 || letterCode == 0x5DB || letterCode == 0x5E4){
						return syllable.substring(0,2);
					}
				}
				// no break here!
			default:	
				return syllable[0];
			}  
	  };
  }).service('audioService', function($http, $q){
	  try{
	  	  this.context = new AudioContext();		  
	  }
	  catch(err){
		  try{
			  this.context = new webkitAudioContext();
		  }
		  catch(err){
			  
		  }
	  }
	  
	  this.playFromBuffer = function(context, buffer, cb){
			  var audioSource = context.createBufferSource();
			  audioSource.connect(context.destination);
			  audioSource.buffer = buffer;
//		      audioSource.noteOn(0);
			  if (typeof cb != 'undefined'){
				  cb(buffer.duration);
			  }
 			  audioSource.start(0);
			  audioSource.playbackRate.value = 1;
	
	  };
	  
	  this.concatWords = function(context, word1, word2, cb){
	   /**
	     * Appends two ArrayBuffers into a new one.
	     * 
	     * @param {ArrayBuffer} buffer1 The first buffer.
	     * @param {ArrayBuffer} buffer2 The second buffer.
	     */
 //   	var context = this.context;
    	var playFromBuffer=this.playFromBuffer;
		  
		function appendBuffer(context, buffer1, buffer2) {
	      var numberOfChannels = Math.min( buffer1.numberOfChannels, buffer2.numberOfChannels );
	      var tmp = context.createBuffer( numberOfChannels, (buffer1.length + 0 + buffer2.length), buffer1.sampleRate );
	      for (var i=0; i<numberOfChannels; i++) {
	        var channel = tmp.getChannelData(i);
	        channel.set( buffer1.getChannelData(i), 0);
	        channel.set( buffer2.getChannelData(i), buffer1.length + 0);
	      }
	      return tmp;
	    }

	    /**
	     * Loads a song
	     * 
	     * @param {String} url The url of the song.
	     */
	    function loadSongWebAudioAPI(url1, url2, cb) {
//	      var request = new XMLHttpRequest();

//	      request.open('GET', url, true);
//	      request.responseType = 'arraybuffer';
	    	var deferred1 = $q.defer();
	    	var deferred2 = $q.defer();
	    	var promises = [deferred1.promise, deferred2.promise];
	    	$q.all(promises).then(function(dataArray){
	    		play(dataArray[0], dataArray[1], cb);
	    	},
	    	function(reason) {
				alert('Failed: ' + reason);
				return reason;
			}, function(update) {
				alert('Got notification: ' + update);
			});
	    	$http.get(url1,  {responseType: "arraybuffer"}).success(function(data) {
	    		context.decodeAudioData(data, function(buf){
	    			deferred1.resolve(buf);
	    		});

	    	});
	    	if (url2 != null){
		    	$http.get(url2,  {responseType: "arraybuffer"}).success(function(data) {
		    		context.decodeAudioData(data, function(buf){
		    			deferred2.resolve(buf);
		    		});
		    	});
	    	}
	    	else{
	    		deferred2.resolve(null);
	    	}
	    	
	    	/**
	       * Appends two ArrayBuffers into a new one.
	       * 
	       * @param {ArrayBuffer} data The ArrayBuffer that was loaded.
	       */
	      function play(buf1, buf2, cb) {
	
	    		  if (buf2 != null){
	    			  

	    				  var audioSource = context.createBufferSource();
	    				  audioSource.connect(context.destination);

	    				  // Concatenate the two buffers into one.
	    				  audioSource.buffer = appendBuffer(context, buf1, buf2);
//	    				  audioSource.noteOn(0);
	    				  if (typeof cb != 'undefined'){
	    					  cb(audioSource.buffer.duration);
	    				  }
	    				  audioSource.start(0);
	    				  audioSource.playbackRate.value = 1;

	    			  
	    		  }
	    		  else{
	    			  playFromBuffer(context, buf1, cb);
	    		  }

	      };

	      // When the song is loaded asynchronously try to play it.
//	      request.onload = function() {
//	        play(request.response);
//	      };

//	      request.send();
	    }


	    	loadSongWebAudioAPI(word1, word2, cb);	    	

	  };
	  
  });
 