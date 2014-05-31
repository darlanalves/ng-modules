(function() {
	var Bugsnag = false,
		notificationQueue = [],
		$bugsnag;

	function notifyException(exception, cause, metaData, severity) {
		if (Bugsnag) {
			if (Bugsnag.user !== $bugsnag.user) {
				Bugsnag.user = $bugsnag.user;
			}

			if (angular.isString(exception)) {
				Bugsnag.notify(exception, cause, metaData, severity);
			} else {
				Bugsnag.notifyException(exception, cause, metaData, severity);
			}

			return;
		}

		notificationQueue.push([exception, cause, metaData, severity]);
	}

	/**
	 * @module angular-bugsnag
	 * @author  Darlan Alves <darlan@moovia.com>
	 * @see  https://bugsnag.com/docs/notifiers/js
	 */
	angular.module('angular-bugsnag', ['async-script']).provider('Bugsnag',
		function() {
			var scriptUrl = 'http://d2wy8f7a9ursnm.cloudfront.net/bugsnag-2.min.js',
				apiKey = '';

			/**
			 * Changes the scriptUrl that provides Bugsnag
			 */
			this.scriptUrl = function(scriptUrl_) {
				scriptUrl = scriptUrl_;
			};

			/**
			 * Sets the API key to use with Bugsnag
			 */
			this.setApiKey = function(key) {
				apiKey = key;
			};

			function configure(config) {
				if (Bugsnag) {
					angular.extend(Bugsnag, $bugsnag.$configs, config || {});
				} else {
					angular.extend($bugsnag.$configs, config || {});
				}
			}

			/**
			 * @class Bugsnag
			 * Drop-in replacement to Bugsnag notifier that queues the function calls
			 * until the actual Bugsnag is loaded
			 */
			$bugsnag = {
				$configs: {},
				notify: notifyException,
				notifyException: notifyException,
				configure: configure
			};

			this.$get = ['loadScriptAsync', '$window',
				function(loadScriptAsync, $window) {
					loadScriptAsync(scriptUrl).then(function() {
						if (!$window.Bugsnag) {
							return;
						}

						Bugsnag = $window.Bugsnag;
						Bugsnag.apiKey = apiKey;
						Bugsnag.user = $bugsnag.user || null;

						configure();

						notificationQueue.forEach(function(item) {
							notifyException(item[0], item[1], item[2], item[3]);
						});

						notificationQueue = [];
					});

					return $bugsnag;
				}
			];
		}
	)

	/**
	 * Hack the $exceptioHandler service to notify Bugsnag about exceptions
	 */
	.factory('$exceptionHandler', ['$log',
		function($log) {
			return function(exception, cause) {
				$log.error.apply($log, arguments);

				if (cause) {
					exception.message += ' (caused by "' + cause + '")';
				}

				notifyException(exception);
			};
		}
	]);

})();