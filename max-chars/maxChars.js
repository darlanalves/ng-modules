/**
 * Show a label with the current length and the limit of chars of a given input/textarea, like "100 / 140"
 * Requires ng-model
 *
 * @author Darlan Alves <darlan@moovia.com>
 */
angular.module('max-chars', []).directive('maxChars', ['$compile',
	function($compile) {
		var indicatorTemplate = '<span class="max-chars-label" ng-class="{invalid: count() > max}">{{count()}}/{{max}}</span>';

		return {
			scope: true,
			require: '?ngModel',

			link: function($scope, $element, $attrs, ngModel) {
				if (!ngModel) return;

				var maxlength = +$attrs.maxChars || -1;

				if (maxlength < 0) return;

				var indicator = angular.element(indicatorTemplate);
				$compile(indicator)($scope);
				$element.after(indicator);

				$scope.max = maxlength;
				$scope.count = function() {
					return String(ngModel.$viewValue || '').length;
				};

				function maxLengthValidator(value) {
					var length = String(value || '').length,
						valid = ngModel.$isEmpty(value) || length <= maxlength;

					ngModel.$setValidity('maxlength', valid);

					if (valid) {
						return value;
					}
				}

				ngModel.$parsers.push(maxLengthValidator);
				ngModel.$formatters.push(maxLengthValidator);
			}
		};
	}
]);