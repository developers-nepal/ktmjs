'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var open = require('open');
var fs = require('fs');
var path = require('path');

var episodes = require('./db/Meetup.json');

console.log('Namaste.\nWelcome to Kathmandu Javascript community.');

var server = express();
var port = process.env.PORT || 3000;

server.use(express.static('admin'));
server.use(bodyParser.json());       // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

/* routes */
server.post('/saveevent', function(req, res) {
  console.log('params', req.body);
  var params = req.body;

  if (params.date && params.venue) {
    episodes.push({
      "date": params.date,
      "venue": params.venue
    });

    fs.writeFileSync(
      path.join(__dirname, 'db/Meetup.json'),
      JSON.stringify(episodes),
      'utf8',
      function(err) {
        if (err) throw err;
      });

    res.send('Got it!');
  }
});

server.listen(port, function() {
  console.log('server is up and running on', port);
  console.log('Opening Admin.');
  open("http://localhost:" + port, function(err) {
    if (err) {
      console.log('Unable to open browser, try http://localhost:3000 instead.', err);
    }
  });
});
