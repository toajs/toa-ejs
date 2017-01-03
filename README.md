toa-ejs
====
Ejs render module for toa.

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads][downloads-image]][downloads-url]

## [toa](https://github.com/toajs/toa)

It is a Implementation of v2.x https://github.com/mde/ejs. Checkout [v1.x](https://github.com/toajs/toa-ejs/tree/v1.1.0) for https://github.com/visionmedia/ejs

### Example

```js
const Toa = require('toa')
const toaEjs = require('toa-ejs')

var app = new Toa()
toaEjs(app, {
  root: 'views',
  layout: 'template',
  viewExt: 'html',
  cache: false,
  locals: locals
})
app.use(function * () {
  yield this.render('user', {name: 'toa', age: 1})
})

app.listen(3000)
```

Or you can checkout the [example](https://github.com/toajs/toa-ejs/tree/master/examples).

## Installation

```bash
npm install toa-ejs
```

## API

```js
const toaEjs = require('toa-ejs')
```

### toaEjs(app, options)

It will add `render` method to `context`.

- `options.root`: views root directory, required.
- `options.layout`: global layout file, default is `layout`, set `false` to disable layout.
- `options.viewExt`: view file extension, default is `html`.
- `options.delimiter`: Character to use with angle brackets for open/close, default is `%`.
- `options.cache`: cache compiled function, default is `true`.
- `options.debug`: Output generated function body.
- `options.compileDebug`: When `false` no debug instrumentation is compiled, default is `false`.
- `options.context`: Template function execution context, default is `null`.
- `options.locals`: global locals, can be function type, `this` in the function is toa's `context`.
- `options.writeResp`: Write template to response body, default is `true`.

### context.render(viewName, [data], [options])

return thunk function.

- `options.layout`: global layout file, default is `layout`, set `false` to disable layout.
- `options.writeResp`: Write template to response body, default is `true`.
- `options.debug`: Output generated function body.
- `options.compileDebug`: When `false` no debug instrumentation is compiled, default is `false`.


```js
this.render('user', {name: 'toa', age: 1})
```

```js
this.render('user', {name: 'toa', age: 1}, {compileDebug: true})
```

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

### Include

support ejs default include.

```html
<div>
  <%- include('user/show', {user: user}); %>
</div>
```

### Locals

pass gobal locals by `settings.locals`, locals can be functions that can be called in ejs templates.

```js
const locals = {
  version: 'v1.0.0',
  now: function() {
    return new Date()
  },
  __: function() {
    return this.__.apply(this, arguments) // toa-i18n's `__` method.
  }
}
```

## License

The MIT License (MIT)

[npm-url]: https://npmjs.org/package/toa-ejs
[npm-image]: http://img.shields.io/npm/v/toa-ejs.svg

[travis-url]: https://travis-ci.org/toajs/toa-ejs
[travis-image]: http://img.shields.io/travis/toajs/toa-ejs.svg

[downloads-url]: https://npmjs.org/package/toa-ejs
[downloads-image]: http://img.shields.io/npm/dm/toa-ejs.svg?style=flat-square
