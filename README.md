toa-ejs
====
Ejs render module for toa. support all feature of [ejs](https://github.com/visionmedia/ejs) v1.0.

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Talk topic][talk-image]][talk-url]

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
* locals: global locals, can be function type, `this` in the function is toa's ctx.
* filters: ejs custom filters.
* open: open flog.
* close: close floag.

### Layouts

`toa-ejs` support layout. default layout file is `layout`, if you want to change default layout file, use `settings.layout`. Also you can specify layout by `options.layout` in `this.render`.
Also you can set `layout = false;` to close layout.

```html
<html>
  <head>
    <title>toa ejs</title>
  </head>
  <body>
    <h3>toa ejs</h3>
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

you can custom filters pass by `settings.filters`.

### Locals

pass gobal locals by `settings.locals`, locals can be functions that can be called in ejs templates.

```js
var locals = {
  version: '0.0.1',
  now: function() {
    return new Date();
  },
  __: function() {
    return this.__.apply(this, arguments); // toa-i18n's `__` method.
  }
};
```

## License

The MIT License (MIT)

[npm-url]: https://npmjs.org/package/toa-ejs
[npm-image]: http://img.shields.io/npm/v/toa-ejs.svg

[travis-url]: https://travis-ci.org/toajs/toa-ejs
[travis-image]: http://img.shields.io/travis/toajs/toa-ejs.svg

[talk-url]: https://guest.talk.ai/rooms/a6a9331024
[talk-image]: https://img.shields.io/talk/t/a6a9331024.svg
