'use strict';
var m = require('../mithril');
var TopModel = require('../model/top');

var categorize_pullrequests = require('../categorize_pullrequests');

var TopViewModel = function() {
	this.model = null;

	this.categorized_pullrequests = m.prop({});
	
	this.search_word = m.prop('');
};

TopViewModel.prototype.init_by_top = function(){
	var self = this;

	if(!self.model) {
		return TopModel.read()
		.then(function(model) {
			self.model = model;
			return model;
		})
		.then(function(model) {
			return self.categorized_pullrequests(categorize_pullrequests(model, self.search_word()));
		});
	}
};

TopViewModel.prototype.incremental_search = function(search_word){
	var self = this;

	return self.categorized_pullrequests(categorize_pullrequests(self.model, search_word));
};

module.exports = new TopViewModel();
