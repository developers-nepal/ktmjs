'use strict';

var express = require('express'),
  handlebars = require('handlebars'),
  moment = require('moment'),
  path = require('path'),
  fs = require('fs'),
  router = express.Router();

var db = require('../db.js')();

var _formatDate = require('../utils.js').formatDate;
var _populate = require('../utils.js').populate;

function _publish(episodes) {
  episodes && episodes.forEach(function(episode) {
    episode.URL =  "https://raw.githubusercontent.com/developers-nepal/ktmjs/master/site-admin";

    var hbsTemplate = fs.readFileSync(path.join(__dirname, '../templates/site/index.hbs')).toString();
    var template = handlebars.compile(hbsTemplate);
    var htmlTemplate = template(episode);

    fs.writeFileSync(path.join(__dirname, '../dist/' + episode.date.replace(/\s+/g, '_') + '.html'), htmlTemplate, 'utf8', function(err) {
      if (err) throw err;
    });
  });
}

/* Publish all meetups. */
router.get('/', function(req, res) {
  var _people, _companies;

  db.companies.find({}, function(err, docs) {
    _companies = docs;
    db.people.find({}, function(err, docs) {
      _people = docs;
      db.meetups.find({}, function(err, docs) {
        docs.forEach(function(e) {
          var _date = moment(e.date, 'YYYY/MM/DD');

          e.episode = +e.episode < 10 ? "0" + e.episode : e.episode;
          e.year = _date.year();
          e.month = _date.format('MMMM');
          e.day = _date.format('Do');

          _formatDate(e, "startsAt", "startsAtHr", "startsAtMin", "startsAtAMPM");
          _formatDate(e, "endsAt", "endsAtHr", "endsAtMin", "endsAtAMPM");

          e.endsAtHr = e.endsAtHr > 12 ? e.endsAtHr - 12 : e.endsAtHr;

          if (e.session) {
            e.session.forEach(function(s, idx) {
              var _startingAt = moment(s.time, "HH:mm");
              s.time = s.time + _startingAt.format('a');

              s.index = idx + 1;
              _populate(s, "speakers", _people);
            });
          }

          /* populate with values from db */
          _populate(e, "sponsors", _companies);
          _populate(e, "supporters", _companies);
        });

        _publish(docs);
        res.send('done');
      });
    });
  });
});

module.exports = router;
