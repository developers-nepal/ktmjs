'use strict';

var express = require('express'),
  handlebars = require('handlebars'),
  moment = require('moment'),
  path = require('path'),
  fs = require('fs'),
  router = express.Router();

var db = require('../db.js')();

function _publish(episodes) {
  episodes && episodes.forEach(function(episode) {
    var hbsTemplate = fs.readFileSync(path.join(__dirname, '../templates/site/index.hbs')).toString();
    var template = handlebars.compile(hbsTemplate);
    var htmlTemplate = template(episode);

    fs.writeFileSync(path.join(__dirname, '../dist/' + episode.date.replace(/\s+/g, '_') + '.html'), htmlTemplate, 'utf8', function(err) {
      if (err) throw err;
    });
  });
}

function _formatDate(e, date, hr, min, ampm) {
  var _at = moment(e[date], "HH:mm");
  e[hr] = _at.format('HH');
  e[min] = _at.format('mm');
  e[ampm] = _at.format('a');
}

function _populate(e, field, db) {
  function findAt(arr, id) {
    var index = null;

    arr.forEach(function(e, idx) {
      if (e._id === id) {
        index = idx;
      }
    });

    return index;
  }

  e[field] && e[field].forEach(function(s) {
    var index = findAt(db, s.name);
    if (index >= 0) {
      s.data = db[index]
    }
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

          if (e.sessions) {
            e.sessions.forEach(function(s) {
              var _startingAt = moment(s.time, "HH:mm");
              s.time = s.time + _startingAt.format('a');

              _populate(s, "people", _people);
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
