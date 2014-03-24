angular.module('html-outline').run(['HtmlOutlineService',
	function(HtmlOutlineService) {
		var $ = window.jQuery,

			heading = new Rule('headings', function() {
				this.expect('h1 :not(h3) ~ h2');
				this.expect('h2 ~ h3');
				this.expect('h3 ~ h4');
				this.expect('h4 ~ h5');
				this.expect('h5 ~ h6');
			});

		[heading].forEach(function(rule) {
				HtmlOutlineService.registerRule(rule);
			});
	}
]);