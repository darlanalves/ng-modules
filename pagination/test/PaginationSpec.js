describe('Pagination', function() {
	var Pagination, pagination;

	beforeEach(module('pagination'));

	beforeEach(inject(function(_Pagination_) {
		Pagination = _Pagination_;
		pagination = new _Pagination_();
	}));

	describe('getState(): returns an object with `count`, `currentPage` and `itemsPerPage` properties', function() {
		it('should return the pagination state', function() {
			var state = pagination.getState();

			expect(state).toBeObject();
			expect(state.count).toBeNumber();
			expect(state.currentPage).toBeNumber();
			expect(state.itemsPerPage).toBeNumber();
		});
	});

	describe('setState(): update current page control properties (count, currentPage and itemsPerPage)', function() {
		it('should update pagination state', function() {
			var expected = {
				itemsPerPage: 20,
				count: 100,
				currentPage: 2
			};

			pagination.setState(expected);

			var state = pagination.getState();

			expect(state.itemsPerPage).toBe(expected.itemsPerPage);
			expect(state.currentPage).toBe(expected.currentPage);
			expect(state.count).toBe(expected.count);
		});

		it('should do nothing if a invalid state object is specified', function() {
			var oldState = pagination.getState();
			pagination.setState(null);

			var newState = pagination.getState();
			expect(newState).toEqual(oldState);
		});
	});

	describe('getCurrentPage(): returns the current page number', function() {
		it('should return a number', function() {
			pagination.setState({
				currentPage: 2
			});

			expect(pagination.getCurrentPage).toBeFunction();
			expect(pagination.getCurrentPage()).toBe(2);
		});
	});

	describe('getPageCount()', function() {
		it('should return the page count', function() {
			pagination.setState({
				count: 20,
				currentPage: 1,
				itemsPerPage: 10
			});

			expect(pagination.getPageCount).toBeFunction();
			expect(pagination.getPageCount()).toBe(2);
		});
	});

	describe('hasPrevious()', function() {
		it('should return true if a previous page is available', function() {
			pagination.setState({
				count: 20,
				currentPage: 2,
				itemsPerPage: 10
			});

			expect(pagination.hasPrevious).toBeFunction();
			expect(pagination.hasPrevious()).toBeTrue();
		});

		it('should return false when the first page is reached', function() {
			pagination.setState({
				count: 20,
				currentPage: 1,
				itemsPerPage: 10
			});

			expect(pagination.hasPrevious()).toBeFalse();
		});
	});

	describe('hasNext()', function() {
		it('should return true if a next page is available', function() {
			pagination.setState({
				count: 20,
				currentPage: 1,
				itemsPerPage: 10
			});

			expect(pagination.hasNext).toBeFunction();
			expect(pagination.hasNext()).toBeTrue();
		});

		it('should return false when the last page is reached', function() {
			pagination.setState({
				count: 20,
				currentPage: 2,
				itemsPerPage: 10
			});

			expect(pagination.hasNext()).toBeFalse();
		});
	});

	describe('previous()', function() {
		it('should go to previous page, if available, and return true if succeed', function() {
			pagination.setState({
				count: 50,
				currentPage: 2,
				itemsPerPage: 10
			});

			expect(pagination.previous).toBeFunction();
			expect(pagination.previous()).toBeTrue();

			expect(pagination.getCurrentPage()).toBe(1);
		});

		it('should NOT change the page if is already on first page, returning false', function() {
			pagination.setState({
				count: 50,
				currentPage: 1,
				itemsPerPage: 10
			});

			expect(pagination.previous()).toBeFalse();
			expect(pagination.getCurrentPage()).toBe(1);
		});
	});

	describe('next()', function() {
		it('should go to previous page, if available, and return true if succeed', function() {
			pagination.setState({
				count: 20,
				currentPage: 1,
				itemsPerPage: 10
			});

			expect(pagination.next).toBeFunction();
			expect(pagination.next()).toBeTrue();

			expect(pagination.getCurrentPage()).toBe(2);
		});

		it('should NOT change the page if is already on last page, returning false', function() {
			pagination.setState({
				count: 20,
				currentPage: 2,
				itemsPerPage: 10
			});

			expect(pagination.next()).toBeFalse();
			expect(pagination.getCurrentPage()).toBe(2);
		});
	});

	describe('first()', function() {
		it('should go to first page and return true if succeed', function() {
			pagination.setState({
				count: 20,
				currentPage: 2,
				itemsPerPage: 10
			});

			expect(pagination.first).toBeFunction();
			expect(pagination.first()).toBeTrue();

			expect(pagination.getCurrentPage()).toBe(1);
		});

		it('should NOT change the page if is already on first page, returning false', function() {
			pagination.setState({
				count: 20,
				currentPage: 1,
				itemsPerPage: 10
			});

			expect(pagination.first()).toBeFalse();
			expect(pagination.getCurrentPage()).toBe(1);
		});
	});

	describe('last()', function() {
		it('should go to last page and return true if succeed', function() {
			pagination.setState({
				count: 20,
				currentPage: 1,
				itemsPerPage: 10
			});

			expect(pagination.last).toBeFunction();
			expect(pagination.last()).toBeTrue();

			expect(pagination.getCurrentPage()).toBe(2);
		});

		it('should NOT change the page if is already on last page, returning false', function() {
			pagination.setState({
				count: 20,
				currentPage: 2,
				itemsPerPage: 10
			});

			expect(pagination.last()).toBeFalse();
			expect(pagination.getCurrentPage()).toBe(2);
		});
	});

	describe('reload()', function() {
		it('should force the reload of current page', function() {
			var oldState = pagination.getState(),
				spy = spyOn(pagination.$events, 'emit');

			expect(pagination.reload).toBeFunction();
			expect(pagination.reload()).toBe(true);

			var newState = pagination.getState();

			expect(newState).toEqual(oldState);
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('reset()', function() {
		it('should restore the default pagination state', function() {
			var oldState = pagination.getState();

			pagination.setState({
				currentPage: 2,
				itemsPerPage: 15,
				count: 30
			});

			pagination.reset();
			var newState = pagination.getState();
			expect(newState).toEqual(oldState);
		});
	});

	describe('on()', function() {
		it('should proxy to EventEmitter#on method', function() {
			var spyOnMethod = spyOn(pagination.$events, 'on');
			pagination.on();

			expect(spyOnMethod).toHaveBeenCalled();
		});
	});

	describe('off()', function() {
		it('should proxy to EventEmitter#off method', function() {
			var spyOffMethod = spyOn(pagination.$events, 'off');
			pagination.off();

			expect(spyOffMethod).toHaveBeenCalled();
		});
	});

	describe('goTo()', function() {
		it('should navigate to a given page', function() {
			expect(pagination.goTo).toBeFunction();

			pagination.setState({
				currentPage: 1,
				itemsPerPage: 15,
				count: 30
			});

			pagination.goTo(2);

			expect(pagination.getState().currentPage).toBe(2);
		});
	});

});