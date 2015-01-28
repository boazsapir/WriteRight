<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>

<%@ page import="com.google.appengine.api.utils.SystemProperty" %>

<html ng-app="myApp">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta name='viewport' content='width=device-width, height=device-height, initial-scale=0.9' />
 <link rel="stylesheet" href="./bower_components/ngDialog/css/ngDialog.css">
 <link rel="stylesheet" href="./bower_components/ng-table/dist/ng-table.min.css">
	<link rel="stylesheet" href="./bower_components/ngDialog/css/ngDialog-theme-default.css">
	<link rel="stylesheet" href="./bower_components/ngDialog/css/ngDialog-theme-plain.css">
 	<script type='text/javascript'>
 	//window.alert('000');
 	  		function startApp() {

			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
						.test(navigator.userAgent)) {
					//	window.alert('mobile');
					document.isMobile = true;
				}
				document.useJQueryDraggable = document.isMobile;
//				jQuery.event.props.push('dataTransfer');
				window.init();

			}
		</script>
	<link rel="stylesheet" href="css/app.css"/>
     <title>Reading Game</title>
  <script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-52065834-1', '1-dot-fast-gate-545.appspot.com');
  ga('send', 'pageview');

</script>
</head>

  <body ng-controller="Main">


<!-- 
<ul class="menu"  ng-show="is_words_backend_ready">
    <li><a href="#/view1">view1</a></li>
    <li><a href="#/view2">view2</a></li>
  </ul>
   -->

 <div ng-view  style="display: block;width:1200"></div>


 <!--  <div>Angular seed app: v<span app-version></span></div>
 -->	
<%
String gapiRoot = null;
Boolean isProduction = true;
if (SystemProperty.environment.value() ==
    SystemProperty.Environment.Value.Production) {
  // Load the class that provides the new "jdbc:google:mysql://" prefix.
	 
  gapiRoot = System.getProperty("appgapiroot.url");
} else {
  // Local dev environment to use during development.
  gapiRoot = System.getProperty("appgapiroot.url.dev");
  isProduction = false;
}

String gameTypeId = request.getParameter("gameId");

%>
 
<script type="text/ng-template" id="firstDialogId">
<div class="ngdialog-content" ng-controller="FeedbackForm">
<form ng-hide="feedbackSubmitted || feedbackSubmissionFailed" ng-submit="sendUserFeedback()"  class="ngdialog-input">
Name <span style="color:red;">*</span><input type="text" name="name" ng-model="userName" autofocus required>
eMail <span style="color:red;">*</span><input type="text" name="email" ng-model="userEmail" required>
Comments <span style="color:red;">*</span><textarea rows="5" cols="30" name="message" ng-model="userMessage" required></textarea>
<input type="submit" id="submit" value="Submit" class="ngdialog-button">
</form>
<div ng-show="feedbackSubmitted" class="ngdialog-message">
Thank You, Your Feedback Has Been Submitted
</div>  
<div ng-show="feedbackSubmissionFailed" class="ngdialog-message">
Feedback Submission Failed<br>
Please send your feedback by email to <b>tuval@appy2write.com</b>
</div>  
</div>
</script>
	<script>var gapiRoot = "<%=gapiRoot%>";
	</script>
	<script>
		var gameTypeId =
	<%=gameTypeId != null ? gameTypeId : 2%>
		;
		var isProduction =
	<%=isProduction%></script>
	<script
		src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5.js"></script>
	<script
		src="http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
	<script src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
	<script src="http://code.jquery.com/ui/1.8.21/jquery-ui.min.js"></script>
	<script src="./jquery.ui.touch-punch.js"></script>
	<script src="./bower_components/angular/angular.min.js"></script>
	<script src="./bower_components/angular-route/angular-route.min.js"></script>
	<script src="./bower_components/angular-animate/angular-animate.min.js"></script>
	<script src="./bower_components/angular-touch/angular-touch.min.js"></script>
	<script
		src="./bower_components/angular-translate/angular-translate.min.js"></script>

	<script src="./bower_components/ngDialog/js/ngDialog.min.js"></script>
	<script src="./bower_components/ng-table/dist/ng-table.js"></script>
	<script src="./js/app.js"></script>
	<script src="./js/services.js"></script>
	<script src="./js/controllers.js"></script>
	<script src="./js/filters.js"></script>
	<script src="./js/directives.js"></script>
	<script src="./js/animations.js"></script>

	<script src="https://apis.google.com/js/client.js?onload=startApp"></script>

</body>
</html>