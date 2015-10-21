var app = angular.module('musicProj').service('artistService', function($http) {
	this.getAlbums = function (id) {
        return $http({
            method: 'GET',
            url: "https://api.spotify.com/v1/artists/" + id + "/albums?album_type=album&market=US"

        }).then(function(res) {
        	var arr = res.data.items
        	var newArray = [];
        	for (var i = 0; i < arr.length; i++) {
        		var seen = false;
        		for (var j = 0; j < newArray.length; j++) {
        			if (newArray[j].name === arr[i].name) {
        				seen = true;
        			}
        		}
        		if (!seen && (arr[i].name.indexOf('Edited') === -1) && (arr[i].name.indexOf('Clean') === -1)) {
        			newArray.push(arr[i]);
        		}
        	}
           	return newArray;
    })
        
	}
	this.getConcerts = function(id) {
		return $http({
			method: 'GET',
			url: 'http://developer.echonest.com/api/v4/artist/profile?api_key=LBWRFZABYTN02NGHA&id=spotify:artist:'+ id +'&format=json&bucket=artist_location'
		}).then(function(res) {
			return $http({
				method: 'GET',
				url: 'http://developer.echonest.com/api/v4/artist/profile?api_key=LBWRFZABYTN02NGHA&id='+ res.data.response.artist.id + '&bucket=id:songkick&format=json'

			}).then(function(resp) {
				var theData = resp.data.response.artist.foreign_ids[0].foreign_id;
				theData = theData.replace(/\D/g,'');

				console.log('slongkick id', theData);
				return $http({
					method: 'GET',
					url: 'http://api.songkick.com/api/3.0/artists/'+ theData +'/calendar.json?apikey=xMQQ3qQoqkOgPKXE'
				}).then(function(res) {
					return res.data.resultsPage.results.event;
					
				})			
			})
		})
	}
	this.getRelated = function(id) {
		return $http({
			method: 'GET',
			url: 'https://api.spotify.com/v1/artists/'+ id +'/related-artists'
		}).then(function(res) {
			return res.data.artists;
		})
	}

})