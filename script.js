var twitchApp = angular.module('twitchApp', ['ngStorage']);

twitchApp.controller('StreamersController', function($scope, $http, $localStorage) {
	$scope.streams = [];
	var api = "https://api.twitch.tv/kraken/";
	$scope.$storage = $localStorage.$default({
          streamers : ["esl_sc2", "ogamingsc2", "brunofin", "cretetion", "comster404", "freecodecamp", "storbeck", "habathcx", "robotcaleb", "noobs2ninjas"]
  });
	$scope.streamers = $scope.$storage.streamers;
	$scope.updateStreams = function() {
		angular.forEach($scope.streamers, function(user, key) {
			$http.jsonp(api + "streams/" + user + "?callback=JSON_CALLBACK&client_id=cdr45y7h4cvb36fr96ilvdazgephvr5")
				.then(function(response) {
				//if user is offline
					if (response.data.stream === null || !response.data.stream) {
						$http.jsonp(api + "channels/" + user + "?callback=JSON_CALLBACK&client_id=cdr45y7h4cvb36fr96ilvdazgephvr5")
							.then(function(channels) {
							//if user is banned
								if (channels.data.status === 422) {
									$scope.streams.push({
										logo: "https://www.theyearinpictures.co.uk/images//image-placeholder.png",
										name: user,
										game: "Account banned",
										online: false
									});
									//if user not extists
								} else if (channels.data.status === 404){
									$scope.streams.push({
										logo: "https://www.theyearinpictures.co.uk/images//image-placeholder.png",
										name: user,
										game: "Account not found",
										online: false
									});
									//if user exists
								} else {
									$scope.streams.push({
										logo: channels.data.logo,
										name: channels.data.display_name,
										url: channels.data.url,
										online: false
									});
								}
							});
						//if user is online
					} else {
						var a = response.data.stream.channel;
						$scope.streams.push({
							logo: a.logo,
							name: a.display_name,
							game: a.game,
							status: ": " + a.status,
							url: a.url,
							online: true
						});
					}
				});
		});
	};
	//fetch streams
	$scope.updateStreams();
	
	$scope.removeStream = function(user) {
		var index = $scope.streams.indexOf(user);
		$scope.streams.splice(index, 1);
		$scope.streamers.splice($scope.streamers.indexOf(user.name.toLowerCase()),1);

	}
	$scope.addStream = function() {

		$scope.streamers.push($scope.newStream.toLowerCase());

		// Clear input fields after push
		$scope.newStream = "";
		$scope.streams = [];
		$scope.updateStreams();

	};
});