'use strict'
// **Github:** https://github.com/toajs/toa-ejs
//
// **License:** MIT

/*global describe, it */

var assert = require('assert')
var render = require('..')
var request = require('supertest')
var toa = require('toa')

describe('test/write-response.test.js', function () {
  describe('writeResp option', function () {
    it('should return html with default configuration and writeResp option = false', function (done) {
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

      request(app.listen())
        .get('/')
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/zensh/)
        .expect(200, done)
    })

    it('should return html with configuration writeResp = false', function (done) {
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

      request(app.listen())
        .get('/')
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/zensh/)
        .expect(200, done)
    })
  })
})
