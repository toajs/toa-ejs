'use strict';
// **Github:** https://github.com/toajs/toa-ejs
//
// **License:** MIT

var toa = require('toa');
var toaEjs = require('../index');

var app = toa(function(Thunk) {
  var users = [{
    name: 'Toa 1'
  }, {
    name: 'Toa 2'
  }, {
    name: 'Toa 3'
  }];
  return this.render('content', {
    users: users
  });
});

var locals = {
  version: 'v2.0.0',
  now: function() {
    return new Date();
  },
  ip: function() {
    return this.ip;
  },
};

toaEjs(app, {
  root: 'examples/views',
  layout: 'template',
  viewExt: 'html',
  cache: false,
  locals: locals
});

module.exports = app.listen(3000);

console.log('open http://localhost:3000');
