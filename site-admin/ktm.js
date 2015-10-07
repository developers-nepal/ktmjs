'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var exphbs  = require('express-handlebars');
var fs = require('fs');
var handlebars = require('handlebars');
var open = require('open');
var path = require('path');
var multer = require('multer');

var episodes = require('./db/Meetup.json');

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

  _save(params);
  res.send('Got it!');
});

server.get('/update/:id', function(req, res) {
  var id = req.params.id;

  var index;
  episodes.forEach(function(e, idx) {
    if (e.episode === id) {
      index = idx;
    }
  });

  if (index >= 0) {
    res.render('save', {
      'episodes': episodes[index].episodes,
      'date': episodes[index].episodes,
      'venue': episodes[index].episodes,
      'sessions': episodes[index].sessions,
      'sponsors': episodes[index].sponsors,
      'supporters': episodes[index].supporters,
      'helpers': {
        input: _InputNodesHelper,
        value: _getValueAttribHelper
      }
    });
  }
});

server.get('/delete_event/:id', function(req, res) {
  var id = req.params.id;

  _deleteEpisode(id);
  res.redirect('/');
});

server.get('/save', function(req, res) {
  res.render('save', {
    'sessions': [{'title': '', 'time': '', 'desc': ''}],
    'sponsors': [{'name': '', 'img_src': ''}],
    'supporters': [{'name': '', 'img_src': ''}],
    'helpers': {
      input: _InputNodesHelper,
      value: _getValueAttribHelper
    }
  });
});

server.get('/publish', function(req, res) {
  _publish(episodes);
  res.send('done');
});


server.get('/companies', function(req, res) {
  res.render('companies', {});
});

server.get('/', function(req, res) {
  res.render('index', {"episodes": episodes});
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('req.body', req.body);
    cb(null, './assets/admin/images/companies');
  },
  filename: function (req, file, cb) {
    console.log('file', file.originalname);
    var filename = file.originalname;
    cb(null, file.fieldname + '-' + Date.now() + '.' + filename.substr(filename.lastIndexOf('.')+1));
  }
});

var upload = multer({ storage: storage });
var Datastore = require('nedb');
var db = {};
db.companies = new Datastore({ filename: './db/companies.db', autoload: true});

server.get('/upload', function(req, res) {
  db.companies.find({}, function (err, docs) {
    res.send(docs);
  });
});

server.post('/upload', upload.single('image'), function(req, res) {
  console.log(req.body) // form fields
  console.log(req.file) // form files
  //var url= 'https://raw.githubusercontent.com/developers-nepal/ktmjs/master/site-admin/assets/images/companies/';
  var params = {
    'file': {
      'path': req.file.path,
      'filename': req.file.filename,
      'mimetype': req.file.mimetype,
      'size': req.file.size
    },
    'info': {
      'title': req.body.title,
      'desc': req.body.desc,
      'url': req.body.url
    }
  };

  db.companies.insert(params, function(err, NewDoc) {
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

function _publish(episodes) {
  episodes && episodes.forEach(function(episode) {
    var hbsTemplate = fs.readFileSync(path.join(__dirname, 'template/index.hbs')).toString();
    var template = handlebars.compile(hbsTemplate);
    var htmlTemplate = template(episode);

    fs.writeFileSync(path.join(__dirname, 'dist/' + episode.date.replace(/\s+/g, '_') + '.html'), htmlTemplate, 'utf8', function(err) {
      if (err) throw err;
    });
  });
}

function _save(params) {
  episodes.push(params);

  fs.writeFileSync(path.join(__dirname, 'db/Meetup.json'), JSON.stringify(episodes), 'utf8', function(err) {
    if (err) throw err;
  });
}

function _deleteEpisode(episode) {
  var index;
  episodes.forEach(function(e, idx) {
    if (e.episode === episode) {
      index = idx;
    }
  });

  if (index >= 0) {
    episodes.splice(index, 1);

    fs.writeFileSync(path.join(__dirname, 'db/Meetup.json'), JSON.stringify(episodes), 'utf8', function(err) {
      if (err) throw err;
    });
  }
}

function _InputNodesHelper(type) {
  function _getInputNodes(field, name, value) {
    return '<input type="text" placeholder=' + field + ' name=' + name + (value ? ' value=' + value : '') + ' />';
  }

  var elm = "";
  for (var i=0; i <= this[type].length; i++) {
    for (var key in this[type][i]) {
      elm += _getInputNodes(key, type + '[' + i + ']' + '[' + key + ']', (this[type][i])[key]);
    }
  }

  return elm;
}

function _getValueAttribHelper(elm, key) {
  /* TODO: find a better way to map objects */
  if (this[elm] && !key) {
    return 'value=' + this[elm];
  }

  if (typeof key === "string" && this[elm] && this[elm][key]) {
    return 'value=' + this[elm][key];
  }
}
