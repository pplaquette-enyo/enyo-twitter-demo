enyo.kind({
	name: "App",
	kind: enyo.Control,
	components: [
		// Github ribbon
		{tag: "a", name: "github", components:[
			{tag: "img", classes: "github-banner", src: "https://a248.e.akamai.net/assets.github.com/img/e6bef7a091f5f3138b8cd40bc3e114258dd68ddf/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f7265645f6161303030302e706e67"}
		]},
		
		// Page Header	
		{kind: "Header"},
		
		// Main App
		{name: "main", classes: "container-fluid", components:[
			{name: "headline", classes: "hero-unit", components:[
				{tag: "h1", content: "Search near you."},
				{tag: "p", content: "Search tweets made within 5 miles radius of where you are! This is a simple demo written with Enyo.js 2.0 Core, and Bootstrap UI."},
				{style: "maegin-top: 2em", components: [
				    {tag: "input", name: "searchTerm", style: "height:27px;font-size:20px;position:relative;top:5px; margin-right:5px"},
				    {tag: "button", name: "searchButton", content: "Search", ontap: "getLocation", classes: "btn btn-info btn-large", style: "margin-right: 12px"},
					{tag: "img", name: "spinner", showing: false, style: "position: relative; top: 9px"},
					{tag: "p", name: "geo"},
					{tag: "p", name: "alert", classes: "alert", showing: false}
				]}
			]},
	    	{name: "tweetList"}
		]}
	],

	create: function() {
	    this.inherited(arguments);
		this.$.github.setAttribute('href', 'https://github.com/girliemac/enyo-twitter-demo');
		this.$.github.setAttribute('alt', 'Fork me on GitHub');
	},
	
	getLocation: function() {
		// disable button
		this.$.searchButton.setAttribute('disabled', 'disabled');
		
		// geolocation
		if (navigator.geolocation) {  
			this.$.alert.setShowing(false);
			var options = {timeout: 60000};
			navigator.geolocation.getCurrentPosition(enyo.bind(this, this.search), enyo.bind(this, this.geoErrorHandler), options);
		} else {
		    this.$.alert.setContent("Oopsie, your browser does not support geolocation! Showing results from elsewhere.");
			this.$.alert.setShowing(true);
			this.search();
		}
		
		// show spinner
		this.$.spinner.setAttribute('src', 'images/spinner.gif');
		this.$.spinner.setShowing(true);
	},
	
	geoErrorHandler: function (error) {
		if (error.code == 1) {
			this.$.alert.setContent("Location access is denied. Showing results from elsewhere.");
		} else if ( err.code == 2) {
			this.$.alert.setContent("Position is unavailable. Showing results from elsewhere.");
		}
		this.$.alert.setShowing(true);
		this.search();	
	},
	
	addTweet: function(inResult) {
		var loc = '';
		if (inResult.location) {
			loc = inResult.location;
		} else if (inResult.geo) {
			loc = inResult.geo.coordinates[0] + ', ' + inResult.geo.coordinates[1];
		}
		
	    this.createComponent({
	    	kind: Tweet,
	    	container: this.$.tweetList,
	    	icon: inResult.profile_image_url,
	    	handle: inResult.from_user,
	    	text: inResult.text,
			location: loc
	    });
	},

	search: function(position) {	
		var geo = '';
		if(position) {
			var lat = position.coords.latitude;
			var lon = position.coords.longitude;
			geo = lat + ',' + lon + ',5mi';
			
			console.log('lat: '+ lat + ', lon:' +lon);
			this.displayPlace(lat, lon);
		}
		
		var url = 'http://search.twitter.com/search.json'

		var searchTerm = this.$.searchTerm.hasNode().value;
		var request = new enyo.JsonpRequest({
		    url: url,
		    callbackName: "callback"
		  });
		
		request.response(enyo.bind(this, "processSearchResults"));
		request.go({ 	
			geocode: geo,
			q: searchTerm
		});
	},

	processSearchResults: function(inRequest, inResponse) {
		if (!inResponse) return;
		this.$.tweetList.destroyClientControls();
		enyo.forEach(inResponse.results, this.addTweet, this);
		this.$.tweetList.render();
		
		// no results
		if(inResponse.results.length == 0) {
			this.$.alert.setContent("No results found");
			this.$.alert.setShowing(true);
		}
		
		// remove spinner
		this.$.spinner.setShowing(false);
		
		// enable button 
		this.$.searchButton.setAttribute('disabled', null);
	},
	
	displayPlace: function(lat, lon) {
		// https://api.twitter.com/1/geo/search.json?lat=37.783619854&long=-122.3982
		var url = 'https://api.twitter.com/1/geo/search.json';
		var geocode = '?lat=' + lat + '&long=' + lon; 
		var request = new enyo.JsonpRequest({
		    url: url,
		    callbackName: "callback"
		});
		request.response(enyo.bind(this, "processPlaceResult"));
		request.go({
			lat: lat,
			long: lon 
		});
	},
	
	processPlaceResult: function(inRequest, inResponse) {
		if (!inResponse) return;
		console.log(inResponse);
		var name = inResponse.result.places[0].full_name;
		this.$.geo.setContent('in '+ name);
	},
});