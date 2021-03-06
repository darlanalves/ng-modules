(function(window) {

	function scrollTo(target, offset) {
		target = target || window;
		internalScrollTo(target, offset | 0, window === target);
	}

	function internalScrollTo(target, offset, isWindow, window_) {
		if (!target) return;

		isWindow = !!isWindow;
		offset = offset | 0;

		var $target = $(target),
			$window = $(window_ || window),
			targetOffset = $target.offset(),
			targetPosition = Math.ceil(isWindow ? 1 : +(targetOffset && targetOffset.top || 1)),
			currentPosition = $window.scrollTop(),
			diff, step, limit = 200;

		if (!isWindow && offset) {
			targetPosition -= offset;
		}

		function scroll() {
			if (currentPosition === targetPosition) return;

			diff = Math.abs(currentPosition - targetPosition);
			step = Math.ceil(diff / 5);

			if (step > limit) {
				step = limit;
			}

			if (targetPosition < currentPosition) {
				currentPosition -= step;
			} else {
				currentPosition += step;
			}

			$window.scrollTop(currentPosition);

			setTimeout(scroll, 20);
		}

		scroll();
	}

	function scrollToDirective($window) {
		return {
			restrict: 'A',
			link: function($scope, $element, $attrs) {
				var isWindow = !$attrs.scrollTo,
					target = isWindow ? $window : $attrs.scrollTo;

				$element.click(function() {
					internalScrollTo(target, +$attrs.offset || 0, isWindow, $window);
				});
			}
		};
	}

	angular.module('scrollTo', [])
		.directive('scrollTo', ['$window', scrollToDirective])
		.value('scrollTo', scrollTo);
})(window);