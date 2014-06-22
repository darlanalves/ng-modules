# Bootstrap (or not) pagination

## Code

- [Download it here](https://raw.github.com/darlanalves/ng-modules/master/pagination/pagination.js)

## How to

```
<div pagination="paginatedList"></div>
```

```
// page controller
function Controller ($scope, PaginatedList) {
	var pagination = new PaginatedList();
	$scope.paginatedList = pagination;

	pagination.on('search', function(params, done) {
		// Do the search with `params` and run `done` when you are done
		//
		// The callback must be called with one object: the new pagination state
		// Try this: return a page from an endpoint with `limit`, `page`, `count` and `items`

		// $http.get('/foo', {params: params}).then(function(page) {
		// 		done({
		//			items: page.items,
		//			count: page.count,
		//			itemsPerPage: page.limit,
		//			currentPage: page.page
		// 		});
		// });
	});
}

```

## Dependencies

The module uses two other tiny libs o'mine:

- [EventEmitter](https://raw.github.com/darlanalves/EventEmitter)
- [extends](https://raw.github.com/darlanalves/extends)
