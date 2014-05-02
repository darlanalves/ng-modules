/**
 * Jasmine custom matchers
 *
 * Use:
 * 		expect(foo).toBe(Function|Object|Number|String|Boolean) 		// methods to check data type
 * 		expect(myObject).toBeInstanceOf(MyClass)						// instanceof checking
 *
 * @author Darlan
 */
beforeEach(function() {
	var matchers = {},
		toString = Object.prototype.toString,
		arrString = '[object Array]';

	// this line should not be here, maybe a separated config file in the future?
	jasmine.getEnv().defaultTimeoutInterval = 500;

	['function', 'object', 'number', 'string', 'boolean'].forEach(function(type) {
		var typeName = type.charAt(0).toUpperCase() + type.slice(1);

		matchers['toBe' + typeName] = function() {
			var actual = this.actual,
				typeOfActual = typeof actual,
				isNot = this.isNot,
				assertion = typeOfActual === type;

			if (type === 'function' && actual) {
				// I've added a string limit here to avoid a full fn body dump on console.
				// Knowing the function name and the code first statements should be enough to identify the code.
				actual = String(actual).slice(0, 50) + '...';
			}

			this.message = function() {
				return 'Expected ' + actual + (isNot ? ' NOT' : '') + ' to be of type "' + type + '"';
			};

			return assertion;
		};

	});

	matchers.toBeInstanceOf = function(expected) {
		return this.actual && expected && this.actual instanceof expected;
	};

	matchers.toBeArray = function() {
		var actual = this.actual,
			isNot = this.isNot,
			isArray = false,
			actualStr;

		if (actual !== undefined && actual !== null) {
			actualStr = toString.call(actual);
			isArray = actualStr === arrString;
		} else {
			actualStr = String(actual);
		}

		this.message = function() {
			return 'Expected ' + actualStr + (isNot ? ' NOT' : '') + ' to be an Array';
		};

		return isArray;
	};

	function booleanMatcher(bValue) {
		return function() {
			var actual = this.actual,
				isNot = this.isNot,
				actualStr = String(actual);

			this.message = function() {
				return 'Expected ' + actualStr + (isNot ? ' NOT' : '') + ' to be ' + (bValue ? 'true' : 'false');
			};

			return bValue === actual;
		};
	}

	matchers.toBeTrue = booleanMatcher(true);
	matchers.toBeFalse = booleanMatcher(false);

	this.addMatchers(matchers);
});