'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.2').
  service('diacritics', function() {

	  this.isDiacritic = function(letter, language){
		  var code = letter.charCodeAt(0);
		  switch(language){
		  case 'AR':
			  if ((code >= 1612 && code <= 1631) || code == 1575){
				  return true;
			  }
			  break;
		  case 'HE':
			  if(code>=0x5B0 && code<=0x5bc){
				  return true;
			  }
			  break;
		  default:	
			  break;
		  }
		  

		  return false;
	  };
  }).service('wordHandler',function(diacritics){
	  this.letterSeparator = function(word, language){
		  var letters = word.split("");
		  var retVal = new Array();
		  for (var i = 0, j = 0; i < letters.length; i++, j++) {
			  retVal[j] = letters[i];
			  if (i<letters.length-1 && diacritics.isDiacritic(letters[i+1],language)){
				  retVal[j] += letters[++i];
				  if (i<letters.length-1 && diacritics.isDiacritic(letters[i+1],language)){
					  retVal[j] += letters[++i]; // case of 2 diacritics for one letter (e.g. shadda) 
				  }
			  }
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
  }).service('audioService', function($http){
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
	  
	  this.playFromBuffer = function(context, buffer){
			  var audioSource = context.createBufferSource();
			  audioSource.connect(context.destination);
			  audioSource.buffer = buffer;
//		      audioSource.noteOn(0);
 				  audioSource.start(0);
			  audioSource.playbackRate.value = 1;	
	  };
	  
	  this.concatWords = function(context, word1, word2){
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
	    function loadSongWebAudioAPI(url1, url2) {
//	      var request = new XMLHttpRequest();

//	      request.open('GET', url, true);
//	      request.responseType = 'arraybuffer';
	
	    	$http.get(url1,  {responseType: "arraybuffer"}).success(function(data) {
	    		var data1 = data;
	    		if (url2 != null){
		    		$http.get(url2,  {responseType: "arraybuffer"}).success(function(data2){
		    			play(data1, data2);
		    		});
	    		}
	    		else{
	    			play(data1, null);    			
	    		}
	    	});
	    	/**
	       * Appends two ArrayBuffers into a new one.
	       * 
	       * @param {ArrayBuffer} data The ArrayBuffer that was loaded.
	       */
	      function play(data1, data2) {
	        //decode the loaded data

	    	  context.decodeAudioData(data1, function(buf1) {
	    		  if (data2 != null){
	    			  context.decodeAudioData(data2, function(buf2){
	    				  var audioSource = context.createBufferSource();
	    				  audioSource.connect(context.destination);

	    				  // Concatenate the two buffers into one.
	    				  audioSource.buffer = appendBuffer(context, buf1, buf2);
//	    				  audioSource.noteOn(0);
	    				  audioSource.start(0);
	    				  audioSource.playbackRate.value = 1;
	    			  });
	    		  }
	    		  else{
	    			  playFromBuffer(context, buf1);
	    		  }
	    	  });

	      };

	      // When the song is loaded asynchronously try to play it.
//	      request.onload = function() {
//	        play(request.response);
//	      };

//	      request.send();
	    }


	    	loadSongWebAudioAPI(word1, word2);	    	

	  };
	  
  });
 