'use strict';

var m = require('../mithril');

var TopViewModel = require('../viewmodel/top');


module.exports = {
	controller: function() {
		var self = this;

		// loading start...
		var loaders = document.querySelectorAll(".loader");
		for (var i = 0; i < loaders.length; i++) {
			loaders[i].style.display = "block";
		}

		this.vm = TopViewModel;

		m.startComputation();

		this.vm.init_by_top()
		.then(function() {
			// loading end
			for (var i = 0; i < loaders.length; i++) {
				loaders[i].style.display = "none";
			}
			m.endComputation();
		});

		this.oninput = function(e) {
			var func = m.withAttr("value", self.vm.search_word);
			func(e);
			self.vm.incremental_search(self.vm.search_word());
		};
		this.onunload = function(e) {};
	},
	view: function(ctrl) {
		var categorized_pullrequests = ctrl.vm.categorized_pullrequests();
		return <div>
			<nav class="navbar navbar-default navbar-fixed-top navbar-inverse">
				<div class="container-fluid">
					<div class="navbar-header">
						<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar">
							<span class="sr-only">Toggle navigation</span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</button>
						<a class="navbar-brand">Pull Requests Categorizer</a>
					</div>
					
					<div class="collapse navbar-collapse" id="navbar">
						<form class="navbar-form navbar-left" role="search">
							<div class="form-group">
								<input type="text" class="form-control" placeholder="Search" oninput={ ctrl.oninput } value={ ctrl.vm.search_word() } />
							</div>
						</form>
					</div>
				</div>
			</nav>
			<div class="container-fluid" style="padding-top: 100px;">{
				Object.keys(categorized_pullrequests).slice().sort().map(function(name, i) {
					return <div class="row">
						<div class="col-md-12">
							<div class="panel panel-success">
								<div class="panel-heading">
									<h2 class="panel-title">{ name }</h2>
								</div>
								<table class="table table-hover">
									<tbody>{
										categorized_pullrequests[name].length ? 
											categorized_pullrequests[name].map(function(pull) {
												return <tr key={ pull.number }>
													<td>
														<a href={ pull.html_url }>{ pull.title }</a>
														<small>{ '(#' + pull.number + ' @' +  pull.user.login + ')' }</small>
													</td>
												</tr>;
											})
										: <tr><td>Nothing</td></tr>
									}</tbody>
								</table>
							</div>
						</div>
					</div>;
				})

			}</div>

		</div>;
	}
};
