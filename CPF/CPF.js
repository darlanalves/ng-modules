angular.module('CPF', [])
	.service('CPF', function() {
		function getSumThroughPosition(identity, position) {
			var sum = 0,
				k = position + 2;

			for (var i = 1; i <= position; i++) {
				sum += parseInt(identity.charAt(i - 1)) * (k - i);
			}

			return sum;
		}

		function checkModulusAtPosition(identity, mod, position) {
			return mod === parseInt(identity.charAt(position));
		}

		function getModulusForSum(sum) {
			var mod = (sum * 10) % 11;

			if (mod === 10 || mod === 11) {
				mod = 0;
			}

			return mod;
		}
		/**
		 * Validates a given users' "CPF" code
		 * @param {String} identity
		 */
		function validateCPF(identity) {
			identity = String(identity).replace(/\D+/g, '');

			// the code '00000000000' would pass, but it's invalid
			if (identity.length !== 11 || identity === '00000000000') {
				return false;
			}

			var mod, sum;

			sum = getSumThroughPosition(identity, 9);
			mod = getModulusForSum(sum);

			if (!checkModulusAtPosition(identity, mod, 9)) {
				return false;
			}

			sum = getSumThroughPosition(identity, 10);
			mod = getModulusForSum(sum);

			if (!checkModulusAtPosition(identity, mod, 10)) {
				return false;
			}

			return true;
		}

		return {
			isValid: validateCPF
		};
	})

.directive('validateCpf', ['CPF',
	function(CPF) {
		return {
			require: '?ngModel',
			restrict: 'A',
			link: function($scope, $element, $attrs, ngModel) {
				if (!ngModel) return;

				function validate(ngModel, validatorName, validity, value) {
					ngModel.$setValidity(validatorName, validity);
					return validity ? value : undefined;
				}

				function validateValue(value) {
					return validate(ngModel, '', ngModel.$isEmpty(value) || CPF.isValid(value), value);
				}

				function validateMinLength(value) {
					return validate(ngModel, 'minlength', ngModel.$isEmpty(value) || value.length >= 11, value);
				}

				function validateMaxLength(value) {
					return validate(ngModel, 'maxlength', ngModel.$isEmpty(value) || value.length <= 14, value);
				}

				ngModel.$formatters.push(validateMinLength, validateMaxLength, validateValue);
				ngModel.$parsers.push(validateMinLength, validateMaxLength, validateValue);
			}
		};
	}
]);