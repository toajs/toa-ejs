'use strict'
// **Github:** https://github.com/toajs/toa-ejs
//
// **License:** MIT

const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const thunk = require('thunks').thunk

/**
 * default render options
 * @type {Object}
 */
const defaultSettings = {
  layout: 'layout',
  viewExt: 'html',
  delimiter: '%',
  locals: {},
  cache: true,
  debug: false,
  context: null,
  writeResp: true,
  compileDebug: false
}

/**
 * set app.context.render
 *
 * @param {Application} app toa application instance
 * @param {Object} settings user settings
 */
module.exports = function (app, settings) {
  if (app.context.render) throw new Error('app.context.render is exist!')
  if (!settings || !settings.root) throw new Error('settings.root required')

  const root = path.resolve(process.cwd(), settings.root)
  const cache = Object.create(null)

  merge(settings, defaultSettings)
  const viewExt = settings.viewExt ? '.' + settings.viewExt.replace(/^\./, '') : ''

  app.context.render = function (view, data, options) {
    options = options || {}
    data = merge(data || {}, settings.locals, this)

    return thunk.call(this, function * () {
      let html = yield render(view, data, options)
      let layout = getOption(options, 'layout')
      if (!layout) return html
      // if using layout
      data.body = html
      html = yield render(layout, data, options)
      if (getOption(options, 'writeResp')) {
        // normal operation
        this.type = 'html'
        this.body = html
      }
      return html
    })
  }

  /**
   * generate html with view name, data and options
   * @param {String} view
   * @param {Object} data
   * @param {Object} options
   * @return {String} html
   */
  function * render (view, data, options) {
    view += viewExt
    let viewPath = path.join(root, view)
    // get from cache
    if (cache[viewPath]) return cache[viewPath].call(options.context || settings.context, data)

    let tpl = yield (done) => fs.readFile(viewPath, 'utf8', done)
    let fn = ejs.compile(tpl, {
      cache: settings.cache,
      delimiter: settings.delimiter,
      filename: viewPath,
      _with: settings._with,
      debug: getOption(options, 'debug'),
      compileDebug: getOption(options, 'compileDebug')
    })

    if (settings.cache) cache[viewPath] = fn
    return fn.call(options.context || settings.context, data)
  }

  function getOption (options, name) {
    return options[name] === false ? false : (options[name] || settings[name])
  }
}

/**
 * Expose ejs
 */
module.exports.ejs = ejs

function merge (target, source, ctx) {
  const assignment = function (value, key) {
    if (typeof value !== 'function') target[key] = value
    else target[key] = () => value.apply(ctx, arguments)
  }

  for (let key in source) {
    if (key in target) continue
    assignment(source[key], key)
  }
  return target
}
