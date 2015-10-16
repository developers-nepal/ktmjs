'use strict';

var Datastore = require('nedb');
var db = {
  'companies' : new Datastore({ filename: './db/companies.db', autoload: true}),
  'people' : new Datastore({ filename: './db/people.db', autoload: true}),
  'meetups' : new Datastore({ filename: './db/meetups.db', autoload: true})
};

module.exports = function() {
  return db;
};
