'use strict';

var express = require('express'),
  router = express.Router();

router.get('/', function(req, res) { 
  res.render('admin/people'); 
});

module.exports = router;
