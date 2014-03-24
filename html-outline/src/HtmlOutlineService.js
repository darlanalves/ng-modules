angular.module('html-outline').service('HtmlOutlineService', ['$document', 'Matcher',
	function($document, Matcher) {
		var doc = $document[0],
			matchers = [];

		//function Matcher() {}

		return {
			outlineHtml: function(html) {
				var node = doc.createElement('div');
				node.innerHTML = html;

				return this.outlineElement(node);
			},

			outlineElement: function(element) {
				try {
					matchers.forEach(function(rule) {
						rule.check(element);
					});
				} catch (e) {
					this.handleException(e);
				}
			},

			registerRule: function(matcher) {
				if (matcher instanceof Matcher === false) {
					var error = new Error('You are trying to register a invalid rule!');
					error.rule = matcher;
					throw error;
				}

				matchers.push(matcher);
			}
		};
	}
]);