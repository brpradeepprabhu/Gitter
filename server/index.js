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
app.post('/commit', function (req, res) {
  let clonePath = req.body.folder;
  let message = req.body.message;
  var commands =
    'git commit -m "' + message + '"';
  let outdata = "";
  var options = {
    cwd: clonePath,
    onData: (data) => {
      outdata += data;
    },
    onError: (err) => {
      outdata = "error";

    }
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
app.post('/checkout', function (req, res) {
  let clonePath = req.body.folder;
  let branch = req.body.branch;
  let force = req.body.force;
  console.log(branch);
  var commands =
    'git checkout ' + branch;
  let outdata = "";
  var options = {
    cwd: clonePath,
    onData: (data) => {
      outdata += data;
    },
    onError: (err) => {
      outdata = err;
    }
  };
  nrc.run(commands, options).then(function (exitCodes) {
    if (exitCodes != 0) {
      res.send(outdata);
    } else {
      res.send("success");
    }
  }, function (err) {
    res.send(err);
  });;

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
    if (exitCodes == 0) {
      if (outdata !== "error") {
        res.send((outdata));
      } else {
        res.send("error");
      }
    } else {
      res.send("error");
    }
  });

});
app.post('/getTags', function (req, res, next) {
  res.setHeader('Content-Type', 'text/plain');
  let clonePath = req.body.folder;
  let commands = 'git tag';
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
    if (exitCodes == 0) {
      if (outdata !== "error") {
        res.json((outdata));
      } else {
        res.send("error");
      }
    } else {
      res.send("error");
    }

  });
});
app.post('/getBranches', function (req, res, next) {
  res.setHeader('Content-Type', 'text/plain');
  let clonePath = req.body.folder;
  let commands = 'git branch';
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
    if (exitCodes == 0) {
      if (outdata !== "error") {
        res.json((outdata));
      } else {
        res.send("error");
      }
    } else {
      res.send("error");
    }
  });
});
app.post('/getDiffFile', function (req, res, next) {
  res.setHeader('Content-Type', 'text/plain');
  let clonePath = req.body.folder;
  let fileName = req.body.fileName;
  let staged = req.body.staged;
  let commands = (staged) ? 'git diff --cached ' + fileName : 'git diff ' + fileName;
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
    if (exitCodes == 0) {
      if (outdata !== "error") {
        res.json((outdata));
      } else {
        res.send("error");
      }
    } else {
      res.send("error");
    }

  });
});
app.post('/getPushCount', function (req, res, next) {
  res.setHeader('Content-Type', 'application/text');
  let clonePath = req.body.folder;
  let currentBranch = req.body.branch;
  let currentOrginBranch = req.body.orginBranch;
  currentBranch = (currentBranch) ? currentBranch : 'master';
  let commands = 'git rev-list --left-right ' + currentBranch + '...' + currentOrginBranch + " --count";
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
    if (exitCodes == 0) {
      if (outdata !== "error") {
        res.json((outdata));
      } else {
        res.send("error");
      }
    } else {
      res.send("error");
    }
  });

});
app.post('/getCurrentBranchOrgin', function (req, res, next) {
  res.setHeader('Content-Type', 'application/text');
  let clonePath = req.body.folder;
  let currentBranch = req.body.branch;
  currentBranch = (currentBranch) ? currentBranch : 'master';
  let commands = 'git rev-parse --abbrev-ref --symbolic-full-name @{u}';
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
    if (exitCodes == 0) {
      if (outdata !== "error") {
        res.send((outdata));
      } else {
        res.send("error");
      }
    } else {
      res.send("error");
    }
  });

});
app.post('/push', function (req, res, next) {
  res.setHeader('Content-Type', 'application/text');
  let clonePath = req.body.folder;
  console.log("push", clonePath);
  let commands = 'git push';
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
    if (exitCodes == 0) {
      if (outdata !== "error") {
        res.json((outdata));
      } else {
        res.send("error");
      }
    } else {
      res.send("error");
    }
  });

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

    if (exitCodes == 0) {
      if (outdata !== "error") {
        res.send((outdata));
      } else {
        res.send("error");
      }
    } else {
      res.send("error");
    }

  });

});
app.post('/stageAll', function (req, res, next) {
  res.setHeader('Content-Type', 'text/plain');
  let clonePath = req.body.folder;
  let commands = 'git add .';
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

    if (exitCodes == 0) {
      if (outdata !== "error") {
        res.send((outdata));
      } else {
        res.send("error");
      }
    } else {
      res.send("error");
    }

  });

});
app.post('/tracked', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  let clonePath = req.body.folder;
  commands = ' git diff --staged --name-status';
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
    if (exitCodes == 0) {
      if (outdata !== "error") {
        res.json((outdata));
      } else {
        res.send("error");
      }
    } else {
      res.send("error");
    }
  });
})
app.post('/unStageAll', function (req, res, next) {
  res.setHeader('Content-Type', 'text/plain');
  let clonePath = req.body.folder;
  let commands = 'git reset';
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

    if (exitCodes == 0) {
      if (outdata !== "error") {
        res.send((outdata));
      } else {
        res.send("error");
      }
    } else {
      res.send("error");
    }

  });

});
app.post('/untracked', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  let clonePath = req.body.folder;
  commands = ' git status -s';
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
    if (exitCodes == 0) {
      if (outdata !== "error") {
        res.json((outdata));
      } else {
        res.send("error");
      }
    } else {
      res.send("error");
    }
  });
})


var server = app.listen(8000, function () {
  console.log("server started");

})
