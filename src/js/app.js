'use strict';

var m = require('./mithril');

// top page
var TopPage = require('./component/top.js');

m.route(document.getElementById("root"), "/", {
	"/": TopPage,
});
