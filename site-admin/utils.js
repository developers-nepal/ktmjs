'use strict';

var moment = require('moment');

function _formatDate(e, date, hr, min, ampm) {
  var _at = moment(e[date], "HH:mm");
  e[hr] = _at.format('HH');
  e[min] = _at.format('mm');
  e[ampm] = _at.format('a');
}

function _populate(e, field, db) {
  function findAt(arr, id) {
    var index = null;

    arr.forEach(function(e, idx) {
      if (e._id === id) {
        index = idx;
      }
    });

    return index;
  }

  e[field] && e[field].forEach(function(s) {
    var index = findAt(db, s.name);
    if (index >= 0) {
      s.data = db[index]
    }
  });
}

exports.formatDate = _formatDate;
exports.populate = _populate;
