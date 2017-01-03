'use strict'
// **Github:** https://github.com/toajs/toa-ejs
//
// **License:** MIT

const Toa = require('toa')
const toaEjs = require('../index')

const app = new Toa()
const locals = {
  version: 'v2.0.0',
  now: function () {
    return new Date()
  },
  ip: function () {
    return this.ip
  }
}

toaEjs(app, {
  root: 'examples/views',
  layout: 'template',
  viewExt: 'html',
  cache: false,
  locals: locals
})

app.use(function * () {
  var users = [{
    name: 'Toa 1'
  }, {
    name: 'Toa 2'
  }, {
    name: 'Toa 3'
  }]
  yield this.render('content', {
    users: users
  })
})

module.exports = app.listen(3000)

console.log('open http://localhost:3000')
