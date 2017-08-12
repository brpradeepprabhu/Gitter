var express = require('express');
var app = express();
var cors = require('cors');
var nrc = require('node-run-cmd');
var shellParser = require('node-shell-parser');
var Promise = require("bluebird");
var cmd = require('node-cmd');
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());


var child;
app.get('/', function (req, res) {


})
app.post('/clone', function (req, res) {
  let cloneUrl = req.body.url;
  let clonePath = req.body.folder;
  var commands =
    'git clone ' + cloneUrl;
  var options = {
    cwd: clonePath
  };
  nrc.run(commands, options).then(function (exitCodes) {

    if (exitCodes != 0) {
      res.send("error");
    } else {
      res.send("success");
    }
  }, function (err) {
    res.send(err);
  });;

});
app.post('/log', function (req, res, next) {
  res.setHeader('Content-Type', 'text/plain');

  let clonePath = req.body.folder;
  let commands = 'git log --pretty=format:%h%x09%x09%cn%x09%x09%ci%x09%x09%s$$$';
  let outdata = "";
  let options = {
    cwd: clonePath,
    onData: (data) => {
      outdata += data;
    },
    onError: (err) => {
      outdata = "error";
    }
  };
  nrc.run(commands, options).then(function (exitCodes) {
    res.send(outdata);
  });

});
app.post('/tracked', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  let clonePath = req.body.folder;
  let commands = 'git diff --name-only';
  let outdata = "";
  let options = {
    cwd: clonePath,
    onData: (data) => {
      outdata += data;
    },
    onError: (err) => {
      outdata = "error";
    }
  };
  nrc.run(commands, options).then(function (exitCodes) {
    if (outdata !== "error") {
      res.json(shellParser(outdata));
    } else {
      res.send(outdata);
    }
  });
})
app.post('/untracked', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  let clonePath = req.body.folder;
  let commands = 'git ls-files --others --exclude-standard';
  let outdata = "";
  let options = {
    cwd: clonePath,
    onData: (data) => {
      outdata += data;
    },
    onError: (err) => {
      outdata = "error";
    }
  };
  nrc.run(commands, options).then(function (exitCodes) {
    if (outdata !== "error") {
      res.json(shellParser(outdata));
    } else {
      res.send(outdata);
    }
  });

});
app.post('/folderCheck', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  let clonePath = req.body.folder;
  let commands = 'git rev-parse --is-inside-work-tree';
  let outdata = "";
  let options = {
    cwd: clonePath,
    onData: (data) => {
      outdata += data;
    },
    onError: (err) => {
      outdata = "error";
    }
  };
  nrc.run(commands, options).then(function (exitCodes) {
    if (outdata !== "error") {
      res.send(outdata);
    } else {
      res.send(outdata);
    }
  });

});
var server = app.listen(8000, function () {
  console.log("server started");

})
