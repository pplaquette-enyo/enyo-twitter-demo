enyo.kind({
	name: "Header",
	kind: enyo.Control,
	classes: "navbar navbar-fixed-top",
	content: "Enyo Twitter Search", 
	components: [
		{classes: "navbar-inner", components:[
			{classes: "container-fluid", components:[
				{tag: "a", name: "title", content: "Enyo Simple Twitter Demo", classes: "brand"},
				//{tag: "div", classes: "nav-collapse", components:[
					{tag: "ul", classes: "nav", components: [
						{tag: "li", components:[
							{tag: "a", content: "Enyojs.com", href: "http://enyojs.com"}
						]},
					]}
				//]}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
	    this.$.title.setAttribute('href', '#');
	},	
});