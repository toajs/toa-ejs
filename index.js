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

var readFile = Thunk.thunkify.call(fs, fs.readFile);

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

/**
 * merge object source into object target
 * only if target[prop] not exist
 * @param {Object} target
 * @param {Object} source
 * @param {Object} ctx
 */
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
  })(function(err) {
    if (err) throw err;
    return target;
  });
}

/**
 * cache the generate package
 * @type {Object}
 */
var cache = {};

/**
 * set app.context.render
 *
 * usage:
 * ```
 * yield *this.render('user', {name: 'dead_horse'});
 * ```
 * @param {Application} app koa application instance
 * @param {Object} settings user settings
 */
module.exports = function(app, settings) {
  if (app.context.render) throw new Error('app.context.render is exist!');
  if (!settings || !settings.root) throw new Error('settings.root required');

  copy(defaultSettings).to(settings);

  settings.viewExt = settings.viewExt ? '.' + settings.viewExt.replace(/^\./, '') : '';

  // ejs global options
  // WARNING: if use koa-ejs in multi server
  // filters will regist in one ejs instance
  for (var name in settings.filters) {
    ejs.filters[name] = settings.filters[name];
  }

  /**
   * generate html with ejs function and options
   * @param {Function} fn ejs compiled function
   * @param {Object} options
   * @return {String}
   */
  function renderTpl(fn, options) {
    return options.scope ? fn.call(options.scope, options) : fn(options);
  }

  /**
   * generate html with view name and options
   * @param {String} view
   * @param {Object} options
   * @return {String} html
   */
  function render(view, options) {
    view += settings.viewExt;
    var viewPath = path.resolve(settings.root, view);
    // get from cache
    if (settings.cache && cache[viewPath]) return renderTpl(cache[viewPath], options);

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

      return renderTpl(fn, options);
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
      var layout = ("layout" in options && options.layout === false) ? false : (options.layout || settings.layout);
      if (layout) {
        // if using layout
        options.body = html;
        return render(layout, options);
      }
      return html;
    })(function(err, html) {
      var writeResp = ('writeResp' in options && options.writeResp === false) ? false : (options.writeResp || settings.writeResp);
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
