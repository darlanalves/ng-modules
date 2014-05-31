angular.module('async-script', []).factory('loadScriptAsync', ['$document', '$q', '$timeout',
	function($document, $q, $timeout) {
		var document = $document[0];

		function loadScript(scriptUrl, callback, errback) {
			var scriptTag = document.createElement('script');
			scriptTag.type = 'text/javascript';
			scriptTag.async = true;
			scriptTag.src = scriptUrl;

			// See http://www.nczonline.net/blog/2009/06/23/loading-javascript-without-blocking/
			scriptTag.onreadystatechange = function() {
				if (this.readyState === 'loaded' || this.readyState === 'complete') {
					callback();
					scriptTag.onreadystatechange = null;
				}
			};

			scriptTag.onload = callback;
			scriptTag.onerror = errback;

			document.body.appendChild(scriptTag);
		}

		return function loadScriptAsync(scriptUrl) {
			var deferred = $q.defer();

			function resolve() {
				deferred.resolve();
			}

			function reject() {
				deferred.reject();
			}

			loadScript(scriptUrl, function() {
				$timeout(resolve);
			}, function() {
				$timeout(reject);
			});

			return deferred.promise;
		};
	}
]);