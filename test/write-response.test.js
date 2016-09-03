'use strict'
// **Github:** https://github.com/toajs/toa-ejs
//
// **License:** MIT

var toa = require('toa')
var tman = require('tman')
var assert = require('assert')
var request = require('supertest')
var render = require('..')

tman.suite('test/write-response.test.js', function () {
  tman.suite('writeResp option', function () {
    tman.it('should return html with default configuration and writeResp', function () {
      var app = toa()
      render(app, {
        root: 'examples/views',
        layout: 'template.oc',
        viewExt: 'html',
        delimiter: '$'
      })

      app.use(function (next) {
        return this.render('user.oc', {
          user: {
            name: 'zensh'
          },
          writeResp: false
        })(function (err, html) {
          assert.strictEqual(err, null)
          this.type = 'html'
          this.body = html
        })(next)
      })

      return request(app.listen())
        .get('/')
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/zensh/)
        .expect(200)
    })

    tman.it('should return html with configuration writeResp = false', function () {
      var app = toa()
      render(app, {
        root: 'examples/views',
        layout: 'template.oc',
        viewExt: 'html',
        delimiter: '$',
        writeResp: false
      })

      app.use(function (next) {
        return this.render('user.oc', {
          user: {
            name: 'zensh'
          }
        })(function (err, html) {
          assert.strictEqual(err, null)
          this.type = 'html'
          this.body = html
        })(next)
      })

      return request(app.listen())
        .get('/')
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/zensh/)
        .expect(200)
    })
  })
})
