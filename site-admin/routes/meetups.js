'use strict';

var express = require('express'),
  router = express.Router();

var Datastore = require('nedb');
var db = {
  'companies' : new Datastore({ filename: './db/companies.db', autoload: true}),
  'people' : new Datastore({ filename: './db/people.db', autoload: true}),
  'meetups' : new Datastore({ filename: './db/meetups.db', autoload: true})
};

var DropdownMenu = require('../helpers_hbs.js').DropdownMenu;

router.get('/forms/save/:id', function(req, res) {
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
    res.redirect('/');
  });
});

router.delete('/:id', function(req, res) {
  var id = req.params.id;

  db.meetups.remove({ _id: id }, {}, function (err, numRemoved) {
    res.redirect('/');
  });
});

router.post('/', function(req, res) {
  var params = req.body;

  delete req.body.people;
  delete req.body.companies;

  db.meetups.insert(params, function(err, NewDoc) {
    res.redirect('/');
  });
});

meetups.get('/', function(req, res) {
  db.meetups.find({}, function (err, docs) {
    res.render('admin/index', {"episodes": docs});
  });
});

module.exports = router;
