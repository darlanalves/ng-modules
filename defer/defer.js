angular.module('defer', [])

.provider('deferred', function() {
	this.$get = ['$q', '$timeout', function($q, $timeout) {
		return function(value) {
			var deferred = $q.defer();

			$timeout(function() {
				deferred.resolve(value);
			});

			return deferred.promise;
		};
	}];
})

.provider('rejected', function() {
	this.$get = ['$q', '$timeout', function($q, $timeout) {
		return function(reason) {
			var deferred = $q.defer();

			$timeout(function() {
				deferred.reject(reason);
			});

			return deferred.promise;
		};
	}];
});