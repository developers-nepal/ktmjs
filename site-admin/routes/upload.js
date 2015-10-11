'use strict';

var express = require('express'),
  router = express.Router(),
  multer = require('multer');

/* db */
var Datastore = require('nedb');
var db = {
  'companies' : new Datastore({ filename: './db/companies.db', autoload: true}),
  'people' : new Datastore({ filename: './db/people.db', autoload: true}),
  'meetups' : new Datastore({ filename: './db/meetups.db', autoload: true})
};

var _path = {
  'companies': './assets/admin/images/companies',
  'people': './assets/admin/images/people'
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

server.get('/upload', function(req, res) {
  db[req.query.for].find({}, function (err, docs) {
    res.send(docs);
  });
});

server.post('/upload', upload.single('image'), function(req, res) {
  var params = {
    'file': req.file,
    'info': req.body
  };

  db[req.body.for].insert(params, function(err, NewDoc) {
    res.status(204).end();
  });
});

module.exports = router;
