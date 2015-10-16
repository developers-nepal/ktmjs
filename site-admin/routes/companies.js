'use strict';

var express = require('express'),
  router = express.Router();

var db = require('../db.js')();

router.get('/', function(req, res) {
  db.companies.find({}, function(err, docs) {
    res.render('admin/company_list', { "companies": docs });
  });
});

router.get('/form', function(req, res) {
  res.render('admin/companies');
});

module.exports = router;
