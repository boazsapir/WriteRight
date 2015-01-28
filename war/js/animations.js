'use strict';

/* Animations */
var myApp = angular.module('myApp.animations', []);

myApp.animation('.brokenWord',function(){
	return{
		removeClass:  function(element, className, done){
			TweenLite.set(element, {opacity:0} );
			TweenLite.fromTo(element, 2, {opacity:0}, {opacity:1, ease:Power2.easeIn } );
//			var x = angular.element(element);
//			var y = x.scope();

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
			TweenLite.set(element, {opacity:0} );
			TweenLite.fromTo(element, 2, {opacity:0}, {opacity:1, ease:Power2.easeIn } );
		}

	};

}
);
myApp.animation('.feedbackMessage',function(){
	return{


	removeClass:  function(element, done){
		if(done.valueOf() == "ng-hide"){
			TweenLite.set(element, {opacity: 0});
			TweenLite.to(element, 3, {opacity:1});
			TweenLite.from(element, 2, {left: "-200px", ease:Elastic.easeOut});
		}
		}
	};
}
);
myApp.animation('.jumpDuck',function(){
	return{


		beforeAddClass:  function(element, done){
			angular.element(element).scope().sunImage = 'sunSmall';
			angular.element(element).scope().springImage = 'spring2';
			angular.element(element).scope().trampolineImage = 'trampoline2';

			var tl = new TimelineLite({paused:true,
				onComplete:function(){
									  angular.element(element).scope().duckImage = 'appMonkey';
										}});
			tl.to(element, 1, {bottom: "320px"})
			.to(element, 1, {bottom: "118px", ease:Bounce.easeOut});
			tl.play();

		}
	};
}
);
myApp.animation('.jumpSpring',function(){
	return{

		beforeAddClass:  function(element, done){

			var tl = new TimelineLite({paused:true});

			tl.set(element, {width: '64px', left: '48px'})
			.to(element, 1, {backgroundImage: "url(img/spring2.png)", height: '162px'})
			.set(element, {height: '94px', width: '102px', left: '29px'})
			.to(element, 1, {backgroundImage: "url(img/spring1.png)" });
			tl.play();

		}
	};
}
);
myApp.animation('.jumpTrampoline',function(){
	return{

		beforeAddClass:  function(element, done){

			var tl = new TimelineLite({paused:true});

			tl
			.to(element, 1, {backgroundImage: "url(img/trampoline2.png)", height: '78px', width: '124px', left: '18px', bottom: '+=50px'})
			.set(element, {height: '74px', bottom: '-=50px'})
			.to(element, 1, {backgroundImage: "url(img/trampoline1.png)", width: '133px', height: '74px', left: '13px'});
			tl.play();

		}
	};
}
);
myApp.animation('.scoreChange',function(){
	return{


		beforeAddClass:  function(element, done){
			var tl = new TimelineLite({paused:true});
		
			tl.set(element,{backgroundImage: 'url(../img/sunBig.png)',backgroundPosition: '169px 169px'})
			.to(element, 1, {width: '247px', height: '151px',
			top: '-16px', paddingTop: '95px', left: '-43px', fontSize: '60px', backgroundPosition: '247px 246px', ease:Power1.easeIn});

				tl.to(element, 1, { backgroundPosition: '169px 169px',width: '88px', height: '62px', top: '30px',
					paddingTop: '26px', left: '36px', fontSize: '30px',ease:Power1.easeIn});
				tl.set(element, {backgroundImage: 'url(../img/sunSmall.png)', backgroundPosition: '0px 0px'});

			tl.play();
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
		.to(element, 2, {backgroundColor: "white"});
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