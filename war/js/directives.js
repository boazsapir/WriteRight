'use strict';

/* Directives */


myApp.
directive('formatDate', [function(){

	return{
		restrict: 'E',
		scope: {
			dateString: '='
		},
		link: function(scope, elm, attrs) {
			function addZero(i) {
			    if (i < 10) {
			        i = "0" + i;
			    }
			    return i;
			}

			var date =new Date(scope.dateString);
			if (!isNaN(date)){
				elm.text( date.toLocaleDateString() + " " + addZero(date.getHours()) + ":" + addZero(date.getMinutes()));
			}
		}
	};
}])
.directive('appVersion', ['version', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}])
.directive('showWord', [function(){
	function link(scope, element, attrs) {
		if (scope.firstWord){
			element.addClass("myTestClass1");
		}
		else{
			element.addClass("myTestClass2");

		}
	}
	return {
		link: link
	};
}])
.directive('draggableLetter', [function(){

	function link(scope, element, attributes) {
		if (document.useJQueryDraggable){
			element.draggable({ revert: true });
		}
		else{
			element.attr("draggable", true);			
		}

		element.bind("dragstart", function(eventObject) {
//	      	 window.alert('start drag');
			if (!document.useJQueryDraggable){
				eventObject.originalEvent.dataTransfer.setData("text", attributes.distractor);
			}
		});
        element.bind("touchstart", function(eventObject){
  
        });
	}
	return {
		link: link
	};

}])
.directive('letterDropTarget', ['wordHandler', function(wordHandler){
    return {
        restrict: "A",
        link: function (scope, element, attributes, ctlr) {
        	if (document.useJQueryDraggable){
        		if (attributes.letterindex == scope.currentLetterToComplete){
        			element.droppable({
        				activeClass: "letterDropTarget",
        				hoverClass: "letterDropTarget"
        			});       			
        		}
        		else{
        			element.droppable();
        		}
        	}
            element.bind("dragover", function(eventObject){
            	if(attributes.letterindex == scope.currentLetterToComplete){
            		eventObject.preventDefault();
   
            		element.addClass("letterDropTarget");
            	}
            });
  
            element.bind("dragleave", function(eventObject){
        		element.removeClass("letterDropTarget");
            });
 
            element.bind("drop", function(eventObject) {
            	
            	element.removeClass("letterDropTarget");

            	if (document.useJQueryDraggable){
            		scope.letterSelected(eventObject.originalEvent.srcElement.innerText.replace(/\s+/g,""), scope.$index);
            	}
            	else{
            		scope.letterSelected(eventObject.originalEvent.dataTransfer.getData("text"), scope.$index);
            	}
            	// cancel actual UI element from dropping, since the angular will recreate a the UI element
            	eventObject.preventDefault();
            });

        }
    };
}])
.directive('wordInLevelEditor', function(){

	return{
	restrict: "E",
	scope: {
		wordId: '@id',
		distractors: '=distractors'
	},
	transclude: true,
	controller: function($scope){
		$scope.editing=false;
		$scope.errorMessage="";
		//$scope.distractors=[];
		$scope.addDistractor = function(){
			if (typeof $scope.distractors == 'undefined'){
				$scope.distractors = [];
			}
			$scope.distractors.push("");
//			$scope.$apply();
		};
		$scope.updateWord = function(){
//			$window.alert($scope.selectedWord.word + " " + $scope.selectedGameLevel.levelIndex);
			gapi.client.request({
				'path': gapiRoot + '/_ah/api/words/v1/update_word_in_level' +
				 '/' + $scope.wordId,
				'params' : {distractors: $scope.distractors},
				'method' : 'POST'
				}).execute(function(resp, rawresp){
					if(resp){
						$scope.editing=false;
						$scope.distractors = resp.distractors;
						$scope.$apply();						
					}
					else{
						$scope.$apply($scope.errorMessage=rawresp);
					}
	
				});
		};
	},	
	link: function(scope, element, attrs, tabsCtrl) {
		console.log(scope);

	},
	templateUrl: 'templates/edit-word.html'
	};
});
