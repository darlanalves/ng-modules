(function() {
	/**
	 * @class Pagination
	 * @author Darlan
	 */
	var defaultItemsPerPage = 10,
		arrProto = Array.prototype;

	var Pagination = extend({
		constructor: function Pagination() {
			this.reset();
			this.$events = new EventEmitter();
		},

		reset: function() {
			this.$state = {
				count: 0,
				currentPage: 1,
				itemsPerPage: defaultItemsPerPage
			};

			this.$pageCount = 0;
		},

		next: function() {
			if (!this.hasNext()) return false;
			return this.goTo(this.$state.currentPage + 1);
		},

		previous: function() {
			if (!this.hasPrevious()) return false;
			return this.goTo(this.$state.currentPage - 1);
		},

		first: function() {
			if (!this.hasPrevious()) return false;
			return this.goTo(1);
		},

		last: function() {
			if (!this.hasNext()) return false;
			return this.goTo(this.$pageCount);
		},

		goTo: function(page) {
			if (!page) return false;

			var state = this.$state;
			state.currentPage = page;
			this.$events.emit('pagechange', state, this);

			return true;
		},

		reload: function() {
			return this.goTo(this.getCurrentPage());
		},

		hasNext: function() {
			return (this.$state.currentPage < this.$pageCount);
		},

		hasPrevious: function() {
			return (this.$state.currentPage > 1);
		},

		getCurrentPage: function() {
			return this.$state.currentPage;
		},

		getPageCount: function() {
			return this.$pageCount;
		},

		setState: function(state) {
			if (!(state && angular.isObject(state))) return;

			var count = toInt(state.count, 0),
				currentPage = toInt(state.currentPage),
				itemsPerPage = toInt(state.itemsPerPage);

			this.$state.count = count;
			this.$state.currentPage = currentPage;
			this.$state.itemsPerPage = itemsPerPage;
			this.$pageCount = Math.ceil(count / itemsPerPage);
		},

		getState: function() {
			return angular.extend({}, this.$state);
		},

		on: function() {
			this.$events.on.apply(this.$events, arguments);
		},

		off: function() {
			this.$events.off.apply(this.$events, arguments);
		}
	});

	function toInt(value, defaultValue) {
		return (Number(value) || defaultValue) | 0;
	}

	var PaginatedList = extend(Pagination, {
		filters: null,
		sorting: null,
		populate: null,
		items: null,

		ASC: 'ASC',
		DESC: 'DESC',

		constructor: function PaginatedList() {
			this.items = [];
			this._super();
		},

		goTo: function(page) {
			var result = this._super(page);

			if (result) {
				this.search();
			}

			return result;
		},

		removeAt: function(index, count) {
			arrProto.splice.call(this.items, index, count || 1);
		},

		concat: function(items) {
			this.items = [].concat(this.items).concat(items);
		},

		setFilters: function(filters) {
			this.filters = filters || null;
		},

		getFilters: function() {
			return this.filters ? angular.extend({}, this.filters) : null;
		},

		setFilter: function(name, value) {
			if (!angular.isString(name)) return;

			if (null === this.filters) {
				this.filters = {};
			}

			if (typeof value === 'undefined') {
				delete this.filters[name];
			} else {
				this.filters[name] = value;
			}
		},

		setSorting: function(sorting) {
			this.sorting = sorting;
		},

		getSorting: function() {
			return this.sorting ? angular.extend({}, this.sorting) : null;
		},

		sortBy: function(name, direction) {
			if (!angular.isString(name)) return;

			direction = typeof direction !== 'undefined' ? direction : this.ASC;

			if (null === this.sorting) {
				this.sorting = {};
			}

			this.sorting[name] = direction;
		},

		setItems: function(items) {
			this.items = [].concat(items);
		},

		getItems: function() {
			return this.items;
		},

		hasItems: function() {
			return angular.isArray(this.items) && this.items.length !== 0;
		},

		getParams: function() {
			var params = {},
				pageState = this.getState();

			angular.extend(params, {
				page: pageState.currentPage,
				max: pageState.itemsPerPage
			});

			angular.extend(params, {
				filter: this.getFilters(),
				sort: this.getSorting()
			});

			return params;
		},

		search: function() {
			var me = this,
				params = me.getParams();

			me.$events.emit('search', params, function(page) {
				if (!page) return;

				me.setItems(page.items || []);
				me.setState(page);
			});
		}
	});

	var pagination = angular.module('pagination', []);

	pagination.value('Pagination', Pagination);
	pagination.value('PaginatedList', PaginatedList);
	pagination.directive('pagination', function() {
		return {
			restrict: 'A',
			replace: true,
			template: '<div class="pagination pagination-small pagination-centered">' +
				'<ul>' +
				'<li ng-class="{disabled: !pagination.hasPrevious()}"><a href="javascript:;" ng-click="pagination.previous()">&laquo;</a></li>' +
				'<li ng-class="{active: pagination.getCurrentPage() == page}" ng-repeat="page in pages()"><a href="javascript:;" ng-click="pagination.goTo(page)">{{page}}</a></li>' +
				'<li ng-class="{disabled: !pagination.hasNext()}"><a href="javascript:;" ng-click="pagination.next()">&raquo;</a></li>' +
				'</ul>' +
				'</div>',

			scope: {
				pagination: '='
			},

			link: function($scope) {
				var pagination = $scope.pagination;

				$scope.pages = function() {
					if (!pagination) return [];

					var i = 0,
						len = pagination.getPageCount(),
						list = new Array(len);

					for (; i < len; i++) {
						list[i] = i + 1;
					}

					return list;
				};
			}
		};
	});
}());