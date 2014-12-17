'use strict';
// **Github:** https://github.com/toajs/toa-ejs
//
// **License:** MIT

/**!
 * modified from https://github.com/koajs/ejs
 *
 * Authors:
 *   dead_horse <dead_horse@qq.com> (http://deadhorse.me)
 */

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var Thunk = require('thunks')();
var copy = require('copy-to');
var ejs = require('ejs');

var readFile = Thunk.thunkify(fs.readFile);

/**
 * default render options
 * @type {Object}
 */
var defaultSettings = {
  cache: true,
  layout: 'layout',
  viewExt: 'html',
  open: '<%',
  close: '%>',
  filters: {},
  locals: {},
  debug: false,
  writeResp: true
};

function merge(target, source, ctx) {

  function evaluate(value, key) {
    return Thunk()(function() {
      return typeof value === 'function' ? value.call(ctx) : value;
    })(function(err, res) {
      if (err) throw err;
      target[key] = res;
    });
  }

  return Thunk()(function() {
    var tasks = [];
    for (var key in source) {
      if (key in target) continue;
      tasks.push(evaluate(source[key], key));
    }
    return Thunk.all(tasks);
  });
}

/**
 * set app.context.render
 *
 * usage:
 * ```
 * return this.render('user', {name: 'dead_horse'});
 * ```
 * @param {Application} app toa application instance
 * @param {Object} settings user settings
 */
module.exports = function(app, settings) {
  if (app.context.render) throw new Error('app.context.render is exist!');
  if (!settings || !settings.root) throw new Error('settings.root required');

  var root = path.resolve(process.cwd(), settings.root);
  var cache = Object.create(null);

  copy(defaultSettings).to(settings);

  var viewExt = settings.viewExt ? '.' + settings.viewExt.replace(/^\./, '') : '';

  // ejs global options
  // WARNING: if use toa-ejs in multi server
  // filters will regist in one ejs instance
  for (var name in settings.filters) {
    ejs.filters[name] = settings.filters[name];
  }

  /**
   * generate html with view name and options
   * @param {String} view
   * @param {Object} options
   * @return {String} html
   */
  function render(view, options) {
    view += viewExt;
    var viewPath = path.join(root, view);
    // get from cache
    if (cache[viewPath]) return cache[viewPath].call(options.scope, options);

    return readFile(viewPath, 'utf8')(function(err, tpl) {
      if (err) throw err;
      var fn = ejs.compile(tpl, {
        filename: viewPath,
        _with: settings._with,
        compileDebug: settings.debug,
        open: settings.open,
        close: settings.close
      });

      if (settings.cache) cache[viewPath] = fn;

      return fn.call(options.scope, options);
    });
  }


  app.context.render = function(view, options) {
    // merge global locals to options
    options = options || {};

    // support generator locals
    return Thunk.call(this, merge(options, settings.locals, this))(function(err) {
      if (err) throw err;
      return render(view, options);
    })(function(err, html) {
      if (err) throw err;
      var layout = options.layout === false ? false : (options.layout || settings.layout);
      if (!layout) return html;
      // if using layout
      options.body = html;
      return render(layout, options);
    })(function(err, html) {
      if (err) throw err;
      var writeResp = options.writeResp === false ? false : (options.writeResp || settings.writeResp);
      if (writeResp) {
        //normal operation
        this.type = 'html';
        this.body = html;
      }
      return html;
    });
  };
};

/**
* Expose ejs
*/

module.exports.ejs = ejs;
