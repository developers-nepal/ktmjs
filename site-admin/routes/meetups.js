'use strict';

var express = require('express'),
  path = require('path'),
  router = express.Router();

var DropdownMenu = require('../helpers_hbs.js').DropdownMenu;
var db = require('../db.js')();

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
          'helpers': { dropdown: DropdownMenu }
        });
      });
    });
  });
});

router.get('/forms/update/:id', function(req, res) {
  var id = req.params.id;
  db.companies.find({}, function (err, docs) {
    var _companies = docs;
    db.people.find({}, function(err, docs) {
      var _people = docs;
      db.meetups.findOne({_id: id}, function (err, docs) {
        docs.people = _people;
        docs.companies = _companies;
        docs.helpers = { 'dropdown': DropdownMenu }

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

  delete req.body.people;
  delete req.body.companies;

  db.meetups.insert(params, function(err, NewDoc) {
    res.redirect('/meetups');
  });
});

router.get('/', function(req, res) {
  db.meetups.find({}, function (err, docs) {
    res.render('admin/index', {"episodes": docs});
  });
});

module.exports = router;
