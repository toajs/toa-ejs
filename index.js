'use strict';
// **Github:** https://github.com/toajs/toa-ejs
//
// **License:** MIT

var fs = require('fs');
var path = require('path');
var Thunk = require('thunks')();
var ejs = require('ejs');

var readFile = Thunk.thunkify(fs.readFile);

/**
 * default render options
 * @type {Object}
 */
var defaultSettings = {
  layout: 'layout',
  viewExt: 'html',
  delimiter: '%',
  locals: {},
  cache: true,
  debug: false,
  context: null,
  writeResp: true,
  compileDebug: false
};

/**
 * set app.context.render
 *
 * @param {Application} app toa application instance
 * @param {Object} settings user settings
 */
module.exports = function(app, settings) {
  if (app.context.render) throw new Error('app.context.render is exist!');
  if (!settings || !settings.root) throw new Error('settings.root required');

  var root = path.resolve(process.cwd(), settings.root);
  var cache = Object.create(null);

  merge(settings, defaultSettings);
  var viewExt = settings.viewExt ? '.' + settings.viewExt.replace(/^\./, '') : '';

  app.context.render = function(view, data, options) {
    options = options || {};
    data = merge(data || {}, settings.locals, this);

    return Thunk.call(this)(function(err) {
      if (err) throw err;
      return render(view, data, options);
    })(function(err, html) {
      if (err) throw err;
      var layout = getOption(options, 'layout');
      if (!layout) return html;
      // if using layout
      data.body = html;
      return render(layout, data, options);
    })(function(err, html) {
      if (err) throw err;
      if (getOption(options, 'writeResp')) {
        //normal operation
        this.type = 'html';
        this.body = html;
      }
      return html;
    });
  };

  /**
   * generate html with view name, data and options
   * @param {String} view
   * @param {Object} data
   * @param {Object} options
   * @return {String} html
   */
  function render(view, data, options) {
    view += viewExt;
    var viewPath = path.join(root, view);
    // get from cache
    if (cache[viewPath]) return cache[viewPath].call(options.context || settings.context, data);

    return readFile(viewPath, 'utf8')(function(err, tpl) {
      if (err) throw err;
      var fn = ejs.compile(tpl, {
        cache: settings.cache,
        delimiter: settings.delimiter,
        filename: viewPath,
        _with: settings._with,
        debug: getOption(options, 'debug'),
        compileDebug: getOption(options, 'compileDebug')
      });

      if (settings.cache) cache[viewPath] = fn;
      return fn.call(options.context || settings.context, data);
    });
  }

  function getOption(options, name) {
    return options[name] === false ? false : (options[name] || settings[name]);
  }
};

/**
 * Expose ejs
 */

module.exports.ejs = ejs;

function merge(target, source, ctx) {
  for (var key in source) {
    if (key in target) continue;
    assignment(source[key], key);
  }
  return target;

  function assignment(value, key) {
    if (typeof value !== 'function') target[key] = value;
    else target[key] = function() {
      return value.apply(ctx, arguments);
    };
  }
}
