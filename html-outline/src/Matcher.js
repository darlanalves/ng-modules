(function() {
	function Matcher() {

	}

	Matcher.prototype = {
		constructor: Matcher,
		expect: function() {}
	};

	angular.module('html-outline').value('Matcher', Matcher);
})();