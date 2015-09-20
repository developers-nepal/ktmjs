'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var exphbs  = require('express-handlebars');
var fs = require('fs');
var handlebars = require('handlebars');
var open = require('open');
var path = require('path');

var episodes = require('./db/Meetup.json');

console.log('Namaste.\nWelcome to Kathmandu Javascript community.');

var server = express();
var port = process.env.PORT || 3000;

server.use(bodyParser.json());       // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
server.set('views', 'admin');
/* handlebars as default engine */
server.engine('.hbs', exphbs({extname: '.hbs'}));
server.set('view engine', '.hbs');

/* routes */
server.post('/saveevent', function(req, res) {
  var params = req.body;

  _save(params);
  res.send('Got it!');
});

server.get('/publish', function(req, res) {
  _publish(episodes);
  res.send('done');
});

server.get('/save', function(req, res) {
  res.render('save');
});

server.get('/', function(req, res) {
  res.render('index', {"episodes": episodes});
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

function _publish(episodes) {
  episodes && episodes.forEach(function(episode) {
    var hbsTemplate = fs.readFileSync(path.join(__dirname, 'template/index.hbs')).toString();
    var template = handlebars.compile(hbsTemplate);
    var htmlTemplate = template(episode);

    fs.writeFileSync(path.join(__dirname, 'dist/' + episode.date.replace(/\s+/g, '_') + '.html'), htmlTemplate, 'utf8', function(err) {
      if (err) throw err;
    });
  });
}

function _save(params) {
  episodes.push({
    "date": params.date,
    "venue": params.venue
  });

  fs.writeFileSync(path.join(__dirname, 'db/Meetup.json'), JSON.stringify(episodes), 'utf8', function(err) {
    if (err) throw err;
  });
}
