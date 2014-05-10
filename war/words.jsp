<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>

<%@ page import="com.google.appengine.api.utils.SystemProperty" %>

<html ng-app="myApp">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
 	<script type='text/javascript'>
  		function startApp() {
	  		window.init();

		}
  	</script>
	<link rel="stylesheet" href="css/app.css"/>
     <title>Reading Game</title>
</head>

  <body ng-controller="Main">
    <h1>مرحبا</h1>


<ul class="menu"  ng-show="is_words_backend_ready">
    <li><a href="#/view1">view1</a></li>
    <li><a href="#/view2">view2</a></li>
  </ul>

 <div ng-view ng-show="is_words_backend_ready" style="margin-left: auto; margin-right: auto;display: block; width:800px"></div>


 <!--  <div>Angular seed app: v<span app-version></span></div>
 -->	
<%
String gapiRoot = null;
if (SystemProperty.environment.value() ==
    SystemProperty.Environment.Value.Production) {
  // Load the class that provides the new "jdbc:google:mysql://" prefix.
 
  gapiRoot = System.getProperty("appgapiroot.url");
} else {
  // Local dev environment to use during development.
  gapiRoot = System.getProperty("appgapiroot.url.dev");
}

%>
 <script>var gapiRoot = "<%=gapiRoot%>";</script>
 <script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
 <script src="../bower_components/jquery/src/jquery.js"></script>
 <script src="./bower_components/angular/angular.js"></script>
 <script src="./bower_components/angular-route/angular-route.js"></script>
 <script src="./bower_components/angular-animate/angular-animate.js"></script>
   <script src="./js/app.js"></script>
  <script src="./js/services.js"></script>
  <script src="./js/controllers.js"></script>
  <script src="./js/filters.js"></script>
  <script src="./js/directives.js"></script>
    <script src="./js/animations.js"></script>

  <script src="https://apis.google.com/js/client.js?onload=startApp"></script>

  </body>
</html>