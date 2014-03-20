# CPF

Validates Brazilian CPF numbers (service & directive)

### Service

```js

var app = angular.module('app', ['CPF']);

app.controller('SignupController', ['$scope', 'CPF', function($scope, CPF) {
	// ...

	$scope.doSignup = function() {
		// ...

		if (!CPF.isValid($scope.CPF)) {
			// ...
			return false;
		}
	};
}]);

```

### Directive

```html

<input type="text" validate-cpf="" />

```