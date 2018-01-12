'use strict';

var express = require('express'),
  router = express.Router();
var db = require('../db.js')();
var fs = require('fs');

router.get('/', function (req, res) {
  db.people.find({}, function (err, docs) {
    res.render('admin/people_list', { "people": docs });
  });
});

router.get('/delete/:id', function (req, res) {
  let personId = req.params.id;
  db.people.findOne({ "_id": personId }, {}, function (error, doc) {

    if (!error) {
      db.people.remove({ "_id": personId }, {}, function (error, numRemoved) {
        if (!error) {
          db.people.persistence.compactDatafile();
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
  res.redirect('/people');
});

router.get('/form', function (req, res) {
  res.render('admin/people');
});

module.exports = router;
