'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var exphbs  = require('express-handlebars');
var fs = require('fs');
var handlebars = require('handlebars');
var open = require('open');
var path = require('path');
var multer = require('multer');
var moment = require('moment');

console.log('Namaste.\nWelcome to Kathmandu Javascript community.');

var server = express();
var port = process.env.PORT || 3000;

/* server configurations */
server.use(bodyParser.urlencoded({ extended: true }));    // to support URL-encoded bodies
server.use(bodyParser.json());                            // to support JSON-encoded bodies
server.use(express.static(__dirname + '/assets'));
server.set('views', 'templates/admin');
/* handlebars as default engine */
server.engine('.hbs', exphbs({extname: '.hbs'}));
server.set('view engine', '.hbs');

/* routes */
server.post('/save_event', function(req, res) {
  var params = req.body;

  /* TODO: ? */
  delete req.body.people;
  delete req.body.companies;

  db.meetups.insert(params, function(err, NewDoc) {
    res.redirect('/');
  });
});

server.get('/update/form/:id', function(req, res) {
  var id = req.params.id;
  db.companies.find({}, function (err, docs) {
    var _companies = docs;
    db.people.find({}, function(err, docs) {
      var _people = docs;
      db.meetups.findOne({_id: id}, function (err, docs) {
        docs.people = _people;
        docs.companies = _companies;
        docs.helpers = {
          'dropdown': _DropdownMenuHelper
        }

        res.render('update', docs);
      });
    });
  });
});

server.post('/update/:id', function(req, res) {
  var params = req.body;
  db.meetups.update({ _id: req.params.id }, req.body, {}, function (err, numReplaced) {
    res.redirect('/');
  });
});

server.get('/delete_event/:id', function(req, res) {
  var id = req.params.id;

  db.meetups.remove({ _id: id }, {}, function (err, numRemoved) {
    res.redirect('/');
  });
});

server.get('/save', function(req, res) {
  db.meetups.find({}, function (err, docs) {
    var _meetups = docs;
    db.companies.find({}, function (err, docs) {
      var _companies = docs;
      db.people.find({}, function(err, docs) {
        var _people = docs;

        res.render('save', {
          'episode': _meetups.length ? (_meetups.length + 1) : 1,
          'companies': _companies,
          'people': _people,
          'helpers': {
            dropdown: _DropdownMenuHelper
          }
        });
      });
    });
  });
});

function findAt(arr, id) {
  var index = null;

  arr.forEach(function(e, idx) {
    if (e._id === id) {
      index = idx;
    }
  });

  return index;
}

server.get('/publish', function(req, res) {
  var _people, _companies;

  db.companies.find({}, function(err, docs) {
    _companies = docs;
    db.people.find({}, function(err, docs) {
      _people = docs;
      db.meetups.find({}, function(err, docs) {
        docs.forEach(function(e) {
          var _date = moment(e.date, 'YYYY/MM/DD');

          e.episode = +e.episode < 10 ? "0" + e.episode : e.episode;
          e.year = _date.year();
          e.month = _date.format('MMMM');
          e.day = _date.format('Do');

          var _startingAt = moment(e.startsAt, "HH:mm");
          e.startsAtHr = _startingAt.format('HH');
          e.startsAtMin = _startingAt.format('mm');
          e.startsAtAMPM = _startingAt.format('a');

          var _endingAt = moment(e.endsAt, "HH:mm");
          e.endsAtHr = _endingAt.format('HH');
          e.endsAtMin = _endingAt.format('mm');
          e.endsAtAMPM = _endingAt.format('a');

          if (e.sessions) {
            e.sessions.forEach(function(s) {
              var _startingAt = moment(s.time, "HH:mm");
              s.time = s.time + _startingAt.format('a');

              s.people.forEach(function(p) {
                var index = findAt(_people, p.name);
                if (index >= 0) {
                  p.data = _people[index]
                }
              });
            });
          }

          e.sponsors && e.sponsors.forEach(function(s) {
            var index = findAt(_companies, s.name);
            if (index >= 0) {
              s.data = _companies[index]
            }
          });

          e.supporters && e.supporters.forEach(function(s) {
            var index = findAt(_companies, s.name);
            if (index >= 0) {
              s.data = _companies[index]
            }
          });
        });

        console.log('wtf', docs[1]);
        res.send('done');
      })
    });
  });
});

server.get('/companies', function(req, res) {
  res.render('companies', {});
});

server.get('/people', function(req, res) {
  res.render('people', {});
});

server.get('/', function(req, res) {
  db.meetups.find({}, function (err, docs) {
    res.render('index', {"episodes": docs});
  });
});

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
var Datastore = require('nedb');
var db = {};
db.companies = new Datastore({ filename: './db/companies.db', autoload: true});
db.people = new Datastore({ filename: './db/people.db', autoload: true});
db.meetups = new Datastore({ filename: './db/meetups.db', autoload: true});

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

server.listen(port, function() {
  console.log('server is up and running on', port);
  console.log('Opening Admin.');
  open("http://localhost:" + port, function(err) {
    if (err) {
      console.log('Unable to open browser, try http://localhost:3000 instead.', err);
    }
  });
});

// function _publish(episodes) {
//   episodes && episodes.forEach(function(episode) {
//     var hbsTemplate = fs.readFileSync(path.join(__dirname, 'template/index.hbs')).toString();
//     var template = handlebars.compile(hbsTemplate);
//     var htmlTemplate = template(episode);
//
//     fs.writeFileSync(path.join(__dirname, 'dist/' + episode.date.replace(/\s+/g, '_') + '.html'), htmlTemplate, 'utf8', function(err) {
//       if (err) throw err;
//     });
//   });
// }

function _DropdownMenuHelper(type) {
  function _getInputNodes(name, val) {
    return '<option value=' + val + '>' + name + '</option>';
  }

  var elm = '<select id="' + type + '-dropdown" ' +' name="' + type + '">';

  this[type].forEach(function(i) {
    var name = i.info.title;
    name = (type === 'people') ? i.info.name : name;
    elm += _getInputNodes(name, i._id);
  });

  elm += "</select>";

  return elm;
}
