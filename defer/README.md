# defer

Injectable convenience methods to make resolved/rejected promises

## Usage

```js

var app = angular.module('app', ['defer']);

app.service('MyService', function(rejected) {
	return {
		/**
		 * Gets something
		 * @param  {String} id 		ID of a thing to get
		 * @return {Promise}		A promise
		 */
		getSomething: function(id) {
			if (!id) {
				return rejected(new Error('Missing id!'));
			}

			return $http.get('/api/thing/' + id);
		}
	};
});


app.service('AuthService', function(deferred) {
	var loggedProfile;

	return {
		// ...
		getCurrentProfile: function() {
			return deferred(loggedProfile);
		}
	};
});

app.controller('SomeController', ['AuthService', function(AuthService) {
	AuthService.getCurrentProfile().then(function(profile){
		// ...
	});
}]

```