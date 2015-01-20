'use strict';
// **Github:** https://github.com/toajs/toa-ejs
//
// **License:** MIT

/**!
* modified from https://github.com/koajs/ejs
*
* Authors:
*   dead_horse <dead_horse@qq.com> (http://deadhorse.me)
*/

var toa = require('toa');
var render = require('../index');
var path = require('path');
var Thunk = require('thunks')();

var app = toa(function(Thunk) {
  var users = [{
    name: 'Dead Horse'
  }, {
    name: 'Jack'
  }, {
    name: 'Tom'
  }];
  return this.render('content', {
    users: users
  });
});

var locals = {
  version: '0.0.1',
  now: function() {
    return new Date();
  },
  ip: function() {
    return this.ip;
  },
};

var filters = {
  format: function(time) {
    return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
  }
};

render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: true,
  locals: locals,
  filters: filters
});

module.exports = app.listen(3000);

console.log('open http://localhost:3000');
