'use strict';

/* Animations */
var myApp = angular.module('myApp.animations', []);

myApp.animation('.brokenWord',function(){
	return{
		removeClass:  function(element, className, done){
			TweenLite.set(element, {opacity:1} );
			TweenLite.from(element, 2,  {opacity:0, right: "-=200px", ease:Power2.easeIn } );
			var x = angular.element(element);
			var y = x.scope();

			}
			

	//,
//		beforeAddClass: function(element, className, done){	
//			TweenLite.set(element, {left: "-200px"} );
//			TweenLite.to(element, 4,  {opacity:0});
//			var x = angular.element(element);
//			var y = x.scope();
//			if (y.$last){
//			if (!y.selectNextWord()){
//				y.feedbackVisible = true;
//				y.messageToPlayer = "End of Game!";
//			}
//			done();
//			}
//
//		}
	};
}
);
myApp.animation('.solvedWord',function(){
	return{
		beforeAddClass:  function(element, className, done){
//			TweenLite.set(element, {bottom: "132px"});
			var tl = new TimelineLite({paused:false});
			tl.set(element, {bottom: "140px"}).to(element, 1, {opacity:0}).set(element, {bottom: "0px"});
			//TweenLite.to(element, 1,  {opacity:0} );
		},
	removeClass:  function(element, done){
		var tl = new TimelineLite({paused:false});
		tl.set(element, {opacity:0});
		tl.to(element, 1, {opacity:1}).to(element, 1, {bottom: "0px"});
		//.to(element, 1, {opacity:0});
		}
	};

}
);
myApp.animation('.letterInWord',function(){
	return{
		enter:  function(element, done){
//			TweenLite.set(element, {bottom: "120px"});
			TweenLite.set(element, {opacity:1, color: "blue"} );
			TweenLite.from(element, 2,  {opacity:0, right: "-=200px", ease:Power2.easeIn } );
		}

	};

}
);
myApp.animation('.feedbackMessage',function(){
	return{


	removeClass:  function(element, done){
		TweenLite.set(element, {opacity: 0, fontSize: 48});
		TweenLite.to(element, 3, {color: "blue", opacity:1});
		TweenLite.from(element, 2, {left: "-200px", ease:Elastic.easeOut});
		}
	};
}
);
myApp.animation('.jumpDuck',function(){
	return{


		beforeAddClass:  function(element, done){
			var tl = new TimelineLite({paused:true,
				onComplete:function(){angular.element(element).scope().duckImage = 'duck';}});
			tl.to(element, 1, {bottom: "+48px"})
			.to(element, 1, {bottom: "280px", ease:Bounce.easeOut});
			tl.play();

		}
	};
}
);
myApp.animation('.scoreChange',function(){
	return{


	beforeAddClass:  function(element, done){
		var tl = new TimelineLite({paused:false});
		tl.to(element, 0.5, {fontSize: "64px", color: "black", repeat:2, repeatDelay:0.5})
		.to(element, 0.5, {fontSize: "48px", color: "green"});

		}
	};
}
);
myApp.animation('.wrongLetterSelection',function(){
	return{


	beforeAddClass:  function(element, done){
		var x = angular.element(element);
		var y = x.scope();
//		window.alert(element[0].textContent.charAt(2));
//		window.alert(element[0].attributes.distractor.nodeValue);
		if (y.selectedLetter == element[0].attributes.distractor.nodeValue){
		var tl = new TimelineLite({paused:false});
		tl.to(element, 0.5, {backgroundColor: "red"})
		.to(element, 2, {backgroundColor: "none"});
	}

		}
	};
}
);


myApp.animation('.letterDropTarget',function(){
	// not in use for now because did not work well with ng-show mechanism 
	return{


		beforeAddClass:  function(element, done){

				tl.to(element, 1, {backgroundColor: "green", opacity:1});


	
		}
	};
}
);