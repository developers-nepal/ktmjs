'use strict';

var express = require('express'),
  router = express.Router();

var db = require('../db.js')();
var fs = require('fs');
router.get('/', function(req, res) {
  db.companies.find({}, function(err, docs) {
    res.render('admin/company_list', { "companies": docs });
  });
});

router.get('/delete/:id', function (req, res) {
  let companyId = req.params.id;
  db.companies.findOne({ "_id": companyId }, {}, function (error, doc) {
    if (!error) {
      db.companies.remove({ "_id": companyId }, {}, function (error, numRemoved) {
        if (!error) {
          db.companies.persistence.compactDatafile();
          fs.exists(doc.file.path, function (exists) {
            if (exists) {
              fs.unlink(doc.file.path, function (error) {
                let feedback = error ? error : 'image deleted as well';
                console.log(feedback);
              })
            }
                    })
        }
      });
    }
  })
  res.redirect('/companies');
});

router.get('/form', function(req, res) {
  res.render('admin/companies');
});

module.exports = router;
