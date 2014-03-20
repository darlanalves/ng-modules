## max-chars (directive)

Creates a tag that shows "xx / yy" after a field (input/textarea), with the actual and remaining of chars on a given input area

```html
<input ng-model="username" max-chars="60" />
```

The HTML piece above will be turned into:

```html
<input ng-model="username" max-chars="60" />
<span class="max-chars-label invalid">72 / 60</span>
<!-- the "invalid" class is added when the char count exceeds the limit -->
```
