'use strict';

var express = require('express'),
  router = express.Router();

var db = require('../db.js')();

router.get('/', function(req, res) {
  db.people.find({}, function(err, docs) {
    res.render('admin/people_list', { "people": docs });
  });
});

router.get('/form', function(req, res) {
  res.render('admin/people');
});

module.exports = router;
