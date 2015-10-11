'use strict';

var express = require('express'),
  path = require('path'),
  router = express.Router(),
  multer = require('multer');

/* db */
var db = require('../db.js')();

var _path = {
  'companies': 'assets/admin/images/companies',
  'people': 'assets/admin/images/people'
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.body.for) {
      cb(null, _path[req.body.for]);
    }
  },
  filename: function (req, file, cb) {
    var filename = file.originalname;
    cb(null, file.fieldname + '-' + Date.now() + '.' + filename.substr(filename.lastIndexOf('.')+1));
  }
});

var upload = multer({ storage: storage });

router.get('/', function(req, res) {
  db[req.query.for].find({}, function (err, docs) {
    res.send(docs);
  });
});

router.post('/', upload.single('image'), function(req, res) {
  var params = {
    'file': req.file,
    'info': req.body
  };

  db[req.body.for].insert(params, function(err, NewDoc) {
    res.redirect('/' + req.body.for);
  });
});

module.exports = router;
