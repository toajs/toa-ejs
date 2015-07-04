'use strict'
// **Github:** https://github.com/toajs/toa-ejs
//
// **License:** MIT

/*global describe, it */

var assert = require('assert')
var render = require('../index')
var request = require('supertest')
var toa = require('toa')

describe('test/test.js', function () {
  describe('init()', function () {
    var app = toa()

    it('should throw error if no root', function () {
      assert.throws(function () {
        render(app)
      })
      assert.throws(function () {
        render(app, {})
      })
    })

    it('should init ok', function () {
      render(app, {
        root: __dirname,
        delimiter: '$'
      })
      assert(typeof app.context.render === 'function')
    })
  })

  describe('server', function () {
    it('should render page ok', function (done) {
      var app = require('../examples/app')
      request(app)
        .get('/')
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/<title>toa ejs<\/title>/)
        .expect(/server time is: /)
        .expect(/Toa/)
        .expect(200, done)
    })

    it('should render page ok with custom open/close', function (done) {
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
          }
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
