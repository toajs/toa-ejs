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

var assert = require('assert');
var render = require('../index');
var request = require('supertest');
var toa = require('toa');

describe('test/koa-ejs.test.js', function() {
  describe('init()', function() {
    var app = toa();

    it('should throw error if no root', function() {
      assert.throws(function() {
        render(app);
      });
      assert.throws(function() {
        render(app, {});
      });
    });

    it('should init ok', function() {
      render(app, {
        root: __dirname,
        filters: {
          format: function() {}
        },
        open: '{{',
        close: '}}'
      });
      assert(typeof render.ejs.filters.format === 'function');
      assert(typeof app.context.render === 'function');
    });
  });

  describe('server', function() {
    it('should render page ok', function(done) {
      var app = require('../examples/app');
      request(app)
        .get('/')
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/<title>koa ejs<\/title>/)
        .expect(/server time is: /)
        .expect(/Dead Horse, Jack, Tom/)
        .expect(/dead horse/)
        .expect(200, done);
    });

    it('should render page ok with custom open/close', function(done) {
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
          }
        })(next);
      });

      request(app.listen(7001))
        .get('/')
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/Zed Gu/)
        .expect(200, done);
    });
  });
});
