describe('CPF validation', function() {

	beforeEach(module('CPF'));

	describe('validateUserIdentityCode(): checks if a given user identity code is valid', function() {
		var validValues = ['274.142.595-79', '25642403052'],
			invalidValues = ['00000000000', 'abcabcabaca', '01230120301', null, false, 0];

		it('should return true for valid values', inject(function(CPF) {
			validValues.forEach(function(value) {
				expect(CPF.check(value)).toBe(true);
			});
		}));

		it('should return false for invalid values', inject(function(CPF) {
			invalidValues.forEach(function(value) {
				expect(CPF.check(value)).toBe(false);
			});
		}));

		it('should generate a valid identity', inject(function(CPF) {
			var cpf = CPF.generate();

			expect(CPF.check(cpf)).toBe(true);
		}));
	});
});