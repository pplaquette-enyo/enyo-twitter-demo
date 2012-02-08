enyo.kind({
	name: "Tweet",
	kind: enyo.Control,
	tag: "div",
	classes: "well",
	published: {
		icon: "",
		handle: "",
		text: "",
		location: ""
	},

	components: [
		{name: "icon", classes: "avatar"},
		{tag: "strong", name: "handle"},
		{tag: "p", name: "text"},
		{components: [
			{tag: "i", classes: "icon-map-marker", style: "margin-right: 5px"},
			{tag: "span", name: "location"}
		]}
	],

	create: function() {
		this.inherited(arguments);
		this.iconChanged();
		this.handleChanged();
		this.textChanged();
		this.locationChanged();
	},

	iconChanged: function() {
		this.$.icon.setAttribute('style', 'background-image:url('+this.icon+')');
	},

	handleChanged: function() {
		this.$.handle.setContent(this.handle);
	},

	textChanged: function() {
		this.$.text.setContent(this.text);
	},
	
	locationChanged: function() {
		this.$.location.setContent(this.location);
	},
});