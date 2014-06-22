describe('PaginatedList', function() {
	var search;

	beforeEach(module('pagination'));

	beforeEach(inject(function(PaginatedList) {
		search = new PaginatedList();
	}));

	afterEach(inject(function($httpBackend) {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
		search.off();
		search = null;
	}));

	describe('initial state', function() {
		it('should have null value on properties', function() {
			expect(search.sorting).toBeNull();
			expect(search.filters).toBeNull();
			expect(search.items).toBeArray();
		});
	});

	describe('getFilters()', function() {
		it('should return the current set of filters as object, or null if there are no filters', function() {
			expect(search.getFilters).toBeFunction();

			expect(search.getFilters()).toBeNull();

			var filters = {
				foo: '1'
			};

			search.filters = filters;

			expect(search.getFilters()).toEqual(filters);
		});
	});

	describe('setFilters()', function() {
		it('should set the filters to use on search', function() {
			expect(search.setFilters).toBeFunction();

			search.setFilters({
				foo: 'one'
			});

			expect(search.getFilters()).toEqual(search.filters);
		});
	});

	describe('getSorting()', function() {
		it('should have a method that returns the current set of sorting parameters', function() {
			expect(search.getSorting).toBeFunction();
			expect(search.getSorting()).toBeNull();

			search.sorting = {
				name: 'ASC'
			};

			expect(search.getSorting()).toEqual(search.sorting);
		});
	});

	describe('setSorting()', function() {
		it('should have a method to define sorting parameters', function() {
			expect(search.setSorting).toBeFunction();

			var sorting = {
				name: 'ASC'
			};

			search.setSorting(sorting);
			expect(search.getSorting()).toEqual(sorting);
		});
	});

	describe('getParams()', function() {
		/**
		 * Params Object:
		 * 	{
		 * 		page: 1,
		 * 		max: 20,
		 * 		filter: { "field": "value" },
		 * 		sort: { "field.name": "ASC|DESC" }
		 * 	}
		 */
		it('should return the search params corresponding to current state as object', function() {
			expect(search.getParams).toBeFunction();

			var params = search.getParams();

			expect(params.page).toBeNumber();
			expect(params.max).toBeNumber();
			expect(params.filter).toBeNull();
			expect(params.sort).toBeNull();

			search.setFilters({
				foo: 'foo'
			});

			params = search.getParams();

			expect(params.filter).toBeObject();
		});
	});

	describe('setItems()', function() {
		it('should set the current page`s items', function() {
			expect(search.setItems).toBeFunction();
			search.setItems(['foo', 'bar']);

			var items = search.getItems();
			expect(items).toBeArray();
			expect(items.length).toBe(2);
			expect(items[0]).toBe('foo');
			expect(items[1]).toBe('bar');
		});
	});

	describe('getItems()', function() {
		it('should return the current set of items as array', function() {
			expect(search.getItems).toBeFunction();
			expect(search.getItems()).toBeArray();
		});
	});

	describe('search()', function() {
		it('should emit "search" event with the current state (params) and a callback to update current page`s items on success', function() {
			search.on('search', function(params, callback) {
				callback({
					items: ['foo', 'bar'],
					currentPage: 2,
					itemsPerPage: 20,
					count: 25
				});
			});

			search.search();

			var items = search.getItems();
			expect(items.length).toBe(2);
			expect(items[0]).toBe('foo');
			expect(items[1]).toBe('bar');

			var state = search.getState();
			expect(state.currentPage).toBe(2);
			expect(state.count).toBe(25);
			expect(state.itemsPerPage).toBe(20);
		});
	});

	describe('sortBy()', function() {
		it('should have ASC and DESC constants for sorting direction definition', function() {
			expect(search.ASC).toBe('ASC'),
			expect(search.DESC).toBe('DESC');
		});

		it('should set/update a sorting parameter and the direction to sort', function() {
			expect(search.sortBy).toBeFunction();
			search.sortBy('name', search.ASC);

			var sorting = search.getSorting();
			expect(sorting.name).toBe(search.ASC);

			search.sortBy('name', search.DESC);

			var sorting = search.getSorting();
			expect(sorting).toBeObject();
			expect(sorting.name).toBe(search.DESC);
		});

		it('should reject parameter names that are not strings', function() {
			search.sortBy({});
			expect(search.getSorting()).toBeNull();
		});

		it('should set the direction to ascending by default', function() {
			search.sortBy('name');
			var sorting = search.getSorting();
			expect(sorting.name).toBe(search.ASC);
		});
	});

	describe('setFilter()', function() {
		it('should set/update a filter by name and his value', function() {
			expect(search.setFilter).toBeFunction();
			search.setFilter('name', 'foo');

			var filters = search.getFilters();
			expect(filters).toBeObject();
			expect(filters.name).toBe('foo');
		});

		it('should refuse names that are not strings', function() {
			search.setFilter({});
			expect(search.getFilters()).toBeNull();
		});

		it('should unset the filter if the value is omitted', function() {
			search.setFilter('name', 'foo');
			search.setFilter('name');

			var filters = search.getFilters();
			expect(name in filters).toBeFalse();
		});
	});

	describe('removeAt()', function() {
		it('should remove `count` items at index `index`', function() {
			expect(search.removeAt).toBeFunction();

			search.setItems(['foo', 'bar']);
			search.removeAt(0);

			var items = search.getItems();
			expect(items.length).toBe(1);
			expect(items[0]).toBe('bar');
		});
	});

	describe('concat()', function() {
		it('should append items to current array', function() {
			search.setItems(['foo']);
			search.concat(['bar', 'baz']);

			var items = search.getItems();
			expect(items.length).toBe(3);
			expect(items).toEqual(['foo', 'bar', 'baz']);
		});
	});

	describe('goTo()', function() {
		it('should go to a given page and return true', function() {
			var spySearch = spyOn(search, 'search');

			expect(search.goTo(2)).toBeTrue();

			var params = search.getParams();
			expect(params.page).toBe(2);
			expect(spySearch).toHaveBeenCalled();
		});

		it('should do nothing and return false if no page was given', function() {
			var spySearch = spyOn(search, 'search');

			expect(search.goTo()).toBeFalse();
			expect(spySearch).not.toHaveBeenCalled();
		});
	});

	describe('hasItems()', function() {
		it('should return true if there are items on the page, or false otherwise', function() {
			expect(search.hasItems).toBeFunction();

			search.setItems([]);
			expect(search.hasItems()).toBeFalse();

			search.setItems([1, 2, 3]);
			expect(search.hasItems()).toBeTrue();
		});
	});

});