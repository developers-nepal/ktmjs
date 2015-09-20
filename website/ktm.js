'use strict';
var express = require('express');

console.log('Namaste.\nWelcome to Kathmandu Javascript community.');

var server = express();
var port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log('server is up and running on', port);
});

server.use('/', function(req, res) {
  res.send('Hello World');
});
