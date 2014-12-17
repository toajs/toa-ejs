toa-ejs v1.0.0 [![Build Status](https://travis-ci.org/toajs/toa-ejs.svg)](https://travis-ci.org/toajs/toa-ejs)
====
Ejs render module for toa. support all feature of [ejs](https://github.com/visionmedia/ejs).


## [toa](https://github.com/toajs/toa)

## Usage

### Example

```js
var toa = require('toa');
var render = require('toa-ejs');

var app = toa(function (Thunk) {
  return this.render('user');
});

render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: true,
  locals: locals,
  filters: filters
});

app.listen(3000);
```

Or you can checkout the [example](https://github.com/toajs/toa-ejs/tree/master/examples).

### settings

* root: view root directory.
* layout: global layout file, default is `layout`, set `false` to disable layout.
* viewExt: view file extension, default is `html`.
* cache: cache compiled function flag.
* debug: debug flag.
* locals: global locals, can be function type, `this` in the function is koa's ctx.
* filters: ejs custom filters.
* open: open flog.
* close: close floag.

### Layouts

`toa-ejs` support layout. default layout file is `layout`, if you want to change default layout file, use `settings.layout`. Also you can specify layout by `options.layout` in `this.render`.
Also you can set `layout = false;` to close layout.

```html
<html>
<head>
<title>koa ejs</title>
</head>
<body>
<h3>koa ejs</h3>
<%- body %>
</body>
</html>
```

### Inlcude

support ejs default include.

```html
<div>
<% include user.html %>
</div>
```

### Filters

support ejs filters.

```html
<p><%=: users | map : 'name' | join %></p>
```

you can custom filters pass by `settings.filters'

### Locals

pass gobal locals by `settings.locals`, locals can be functions to get dynamic values.
locals also can be `generatorFunction` or `generator` or `promise` or any other thunkable value, so you can do some async invoke in locals.

```js
var locals = {
  version: '0.0.1',
  now: function () {
    return new Date();
  },
  ip: function *() {  // generatorFunction
    yield wait(10);
    return this.ip; // use this like in koa middleware
  }
};
```



## License

The MIT License (MIT)
