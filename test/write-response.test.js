'use strict';
// **Github:** https://github.com/toajs/toa-ejs
//
// **License:** MIT

/*global describe, it, before, after, beforeEach, afterEach*/
/**!
* modified from https://github.com/koajs/ejs
*
* Authors:
*   dead_horse <dead_horse@qq.com> (http://deadhorse.me)
*/

var render = require('..');
var request = require('supertest');
var toa = require('toa');

describe('test/write-response.test.js', function() {
  describe('writeResp option', function() {
    it('should return html with default configuration and writeResp option = false', function(done) {
      var app = toa();
      render(app, {
        root: 'examples/view',
        layout: 'template.oc',
        viewExt: 'html',
        open: '{{',
        close: '}}'
      });

      app.use(function(next) {
        return this.render('user.oc', {
          user: {
            name: 'Zed Gu'
          },
          writeResp: false
        })(function(err, html) {
          this.type = 'html';
          this.body = html;
        })(next);
      });

      request(app.listen(3000))
        .get('/')
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/Zed Gu/)
        .expect(200, done);

    });

    it('should return html with configuration writeResp = false', function(done) {
      var app = toa();
      render(app, {
        root: 'examples/view',
        layout: 'template.oc',
        viewExt: 'html',
        open: '{{',
        close: '}}',
        writeResp: false
      });

      app.use(function(next) {
        return this.render('user.oc', {
          user: {
            name: 'Zed Gu'
          }
        })(function(err, html) {
          this.type = 'html';
          this.body = html;
        })(next);
      });

      request(app.listen(3000))
        .get('/')
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/Zed Gu/)
        .expect(200, done);

    });
  });
});
