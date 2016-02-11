'use strict';

var m = require('../mithril');
var Github = require('github-api');
var config = require('../config.js');

var TopModel = function (data, isInitial) {
	if(!data) { return; }

	this.list = m.prop(data);
};

TopModel.read = function () {

	var github = new Github({
		apiUrl: config.apiUrl,
		token: config.token,
		auth: config.auth
	});

	var repo = github.getRepo(config.repouser, config.reponame);

	var deferred = m.deferred();

	repo.listPulls({
		state: 'open',
		page: 1,
		per_page: 100
	}, function(err, res) {
		var open_page = res;

		repo.listPulls({
			state: 'closed',
			page: 1,
			per_page: 100
		}, function(err, res) {
			var closed_page = res;

			// open and closed pull requests
			var all_pages = open_page.concat(closed_page);

			return deferred.resolve(new TopModel(all_pages));
		});
	});

	return deferred.promise;
};

module.exports = TopModel;
