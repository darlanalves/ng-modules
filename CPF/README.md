# CPF

Validates Brazilian CPF numbers (service & directive)

## Code
- [Download it here](https://raw.github.com/darlanalves/ng-modules/master/CPF/CPF.js)

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