'use strict';

var get_category_name = function(pull){
	// ignore done pull request
	if(pull.title.match(/Done/)) {
		return;
	}

	if (pull.title.match(/Reviewed/)) {
		return 'Reviewed Pull Requests';
	}
	else if (pull.title.match(/WIP/)) {
		return 'WIP Pull Requests';
	}
	else {
		var dt = new Date();
		var month = dt.getMonth() + 1;
		var day   = dt.getDate();

		var matched = pull.title.match(/\[(\d+)\/(\d+)〆\]/);

		var lmonth,lday;
		if(matched) {
			lmonth = Number(matched[1]);
			lday   = Number(matched[2]);
		}
		else {
			lmonth = 0;
			lday   = 0;
		}

		if (month === lmonth && day === lday) {
			return 'Today Due Date Pull Requests';
		}
		else if (month < lmonth || (month === lmonth && day < lday)) {
			return 'Reserving Pull Requests';
		}
		else {
			return 'Overdue Pull Requests';
		}

	}
};

var categorize_pullrequests = function(model, search_word) {
	// model arguments must be TopModel instance.

	var categorized_pullrequests = {};

	var list = model.list();

	list.sort(function(a,b){
		if(a.number < b.number) return -1;
		if(a.number > b.number) return 1;
		return 0;
	});

	list.forEach(function(pull) {

		if(search_word && pull.title.indexOf(search_word) === -1) { return; }

		var category = get_category_name(pull);

		if(!category) { return; }

		if(!categorized_pullrequests[category]) {
			categorized_pullrequests[category] = [pull];
		}
		else {
			categorized_pullrequests[category].push(pull);
		}
	});

	return categorized_pullrequests;
};

module.exports = categorize_pullrequests;
