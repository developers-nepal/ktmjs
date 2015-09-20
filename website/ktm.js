'use strict';
var express = require('express');
var open = require('open');

console.log('Namaste.\nWelcome to Kathmandu Javascript community.');

var server = express();
var port = process.env.PORT || 3000;

server.use(express.static('admin'));

server.listen(port, function() {
  console.log('server is up and running on', port);
  console.log('Opening Admin.');
  open("http://localhost:" + port, function(err) {
    if (err) {
      console.log('Unable to open browser, try http://localhost:3000 instead.', err);
    }
  });
});
