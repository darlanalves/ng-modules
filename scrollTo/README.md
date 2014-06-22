## scrollTo (directive)

Scrolls to a specific portion of the page, using a CSS selector to match the element where the page should go to.

NOTE: it uses jQuery to calculate page/viewport offsets and sizes


```html
<button scroll-to="#foo">Go to #foo</button>

...

<div id="foo"></div>

```

Also, "scrollTo" is a injectable function, that works the same way: you pass a selector to it and it scrolls to the given element.

```
...
function (scrollTo) {
	// signature: scrollTo(element, offset);
	// element: any valid element selector
	// offset: (optional) numeric value with an offset to subtract on top of current element
	//			(scrolls to elementPosition - offset)
	scrollTo('#foo', 50);
}
```

## Code

[Download it here](https://raw.github.com/darlanalves/ng-modules/master/scrollTo/scrollTo.js)