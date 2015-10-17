'use strict';

var express = require('express'),
  moment = require('moment'),
  path = require('path'),
  router = express.Router();

var db = require('../db.js')();

var _formatDate = require('../utils.js').formatDate;
var _populate = require('../utils.js').populate;

router.get('/forms/save', function(req, res) {
  db.meetups.find({}, function (err, docs) {
    var _meetups = docs;
    db.companies.find({}, function (err, docs) {
      var _companies = docs;
      db.people.find({}, function(err, docs) {
        var _people = docs;

        res.render('admin/save', {
          'episode': _meetups.length ? (_meetups.length + 1) : 1,
          'companies': _companies,
          'people': _people,
          'index': 'index',
          'helpers': {
            json: function(context) {
              return JSON.stringify(context);
            }
          }
        });
      });
    });
  });
});

router.get('/forms/update/:id', function(req, res) {
  /* TODO */
  var id = req.params.id;
  db.companies.find({}, function (err, docs) {
    var _companies = docs;
    db.people.find({}, function(err, docs) {
      var _people = docs;
      db.meetups.findOne({_id: id}, function (err, docs) {
        docs.people = _people;
        docs.companies = _companies;

        res.render('admin/update', docs);
      });
    });
  });
});

router.put('/:id', function(req, res) {
  var params = req.body;
  db.meetups.update({ _id: req.params.id }, req.body, {}, function (err, numReplaced) {
    res.redirect('/meetups');
  });
});

router.get('/delete/:id', function(req, res) {
  var id = req.params.id;

  db.meetups.remove({ _id: id }, {}, function (err, numRemoved) {
    res.redirect('/meetups');
  });
});

router.post('/', function(req, res) {
  var params = req.body;

  params.sponsors = params.sponsors ? params.sponsors.split(',') : null;
  params.supporters = params.supporters ? params.supporters.split(',') : null;

  if (params.session) {
    params.session.forEach(function(s) {
      s.speakers = s.speakers ? s.speakers.split(',') : null;
    })
  }

  db.meetups.insert(params, function(err, NewDoc) {
    res.redirect('/meetups');
  });
});

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

          if (e.session) {
            e.session.forEach(function(s) {
              var _startingAt = moment(s.time, "HH:mm");
              s.time = s.time + _startingAt.format('a');

              _populate(s, "speakers", _people);
            });
          }
          /* populate with values from db */
          _populate(e, "sponsors", _companies);
          _populate(e, "supporters", _companies);
        });

        res.render('admin/index', {"episodes": docs});
      });
    });
  });
});

module.exports = router;
