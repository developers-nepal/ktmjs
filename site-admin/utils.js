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

  var _tmp = [];
  e[field] && e[field].forEach(function(s) {
    var index = findAt(db, s);
    if (index >= 0) {
      _tmp.push(db[index])
    }
  });

  e[field] = _tmp;
}

exports.formatDate = _formatDate;
exports.populate = _populate;
