'use strict'
// **Github:** https://github.com/toajs/toa-ejs
//
// **License:** MIT

var tman = require('tman')
var toa = require('toa')
var assert = require('assert')
var request = require('supertest')
var render = require('../index')

tman.suite('test/test.js', function () {
  tman.suite('init()', function () {
    var app = toa()

    tman.it('should throw error if no root', function () {
      assert.throws(function () {
        render(app)
      })
      assert.throws(function () {
        render(app, {})
      })
    })

    tman.it('should init ok', function () {
      render(app, {
        root: __dirname,
        delimiter: '$'
      })
      assert(typeof app.context.render === 'function')
    })
  })

  tman.suite('server', function () {
    tman.it('should render page ok', function () {
      var app = require('../examples/app')
      return request(app)
        .get('/')
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/<title>toa ejs<\/title>/)
        .expect(/server time is: /)
        .expect(/Toa/)
        .expect(200)
    })

    tman.it('should render page ok with custom open/close', function () {
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

      return request(app.listen())
        .get('/')
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/zensh/)
        .expect(200)
    })
  })
})
