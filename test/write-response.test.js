'use strict'
// **Github:** https://github.com/toajs/toa-ejs
//
// **License:** MIT

const Toa = require('toa')
const tman = require('tman')
const request = require('supertest')
const render = require('..')

tman.suite('test/write-response.test.js', function () {
  tman.suite('writeResp option', function () {
    tman.it('should return html with default configuration and writeResp', function () {
      const app = new Toa()
      render(app, {
        root: 'examples/views',
        layout: 'template.oc',
        viewExt: 'html',
        delimiter: '$'
      })

      app.use(function * () {
        let html = yield this.render('user.oc', {
          user: {
            name: 'zensh'
          },
          writeResp: false
        })
        this.type = 'html'
        this.body = html
      })

      return request(app.listen())
        .get('/')
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/zensh/)
        .expect(200)
    })

    tman.it('should return html with configuration writeResp = false', function () {
      const app = new Toa()
      render(app, {
        root: 'examples/views',
        layout: 'template.oc',
        viewExt: 'html',
        delimiter: '$',
        writeResp: false
      })

      app.use(function * () {
        let html = yield this.render('user.oc', {
          user: {
            name: 'zensh'
          }
        })
        this.type = 'html'
        this.body = html
      })

      return request(app.listen())
        .get('/')
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/zensh/)
        .expect(200)
    })
  })
})
