'use strict';

/* Directives */


angular.module('myApp.directives', []).
directive('appVersion', ['version', function(version) {
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
        		if (attributes.letter == wordHandler.placeHolderChar('ar')){
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
            	if(attributes.letter == wordHandler.placeHolderChar('ar')){
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
}]);
