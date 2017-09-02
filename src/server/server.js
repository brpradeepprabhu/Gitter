var express = require('express');
var app = express();
var cors = require('cors');
var nrc = require('node-run-cmd');
var shellParser = require('node-shell-parser');

app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());


app.get('/', function (req, res) {


});

app.post('/discardAll', function (req, res) {
  let clonePath = req.body.folder;
  var commands = ["git checkout .", "git clean -f"];
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

})
app.post('/discardFile', function (req, res) {
  let clonePath = req.body.folder;
  let fileName = req.body.fileName;
  var commands = "git checkout -q -- " + fileName;
  console.log(commands);
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
app.post('/fetch', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  let clonePath = req.body.folder;
  let commands = 'git fetch';
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
app.post('/folderCheck', function (req, res) {
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
app.post('/getTags', function (req, res) {
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
app.post('/getBranches', function (req, res) {
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
app.post('/getRemoteBranches', function (req, res) {
  res.setHeader('Content-Type', 'text/plain');
  let clonePath = req.body.folder;
  let commands = 'git branch -r';
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
app.post('/getDiffFile', function (req, res) {
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
app.post('/getPushCount', function (req, res) {
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
app.post('/getCurrentBranchOrgin', function (req, res) {
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
app.post('/getListOfFilesCommit', function (req, res) {
  res.setHeader('Content-Type', 'application/text');
  let clonePath = req.body.folder;
  let commitid = req.body.commitid;
  let commands = 'git diff-tree --no-commit-id --name-only -r ' + commitid;
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
app.post('/push', function (req, res) {
  res.setHeader('Content-Type', 'application/text');
  let clonePath = req.body.folder;
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
app.post('/pull', function (req, res) {
  res.setHeader('Content-Type', 'application/text');
  let clonePath = req.body.folder;
  let commands = 'git pull';
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
app.post('/log', function (req, res) {
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
app.post('/stageAll', function (req, res) {
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
app.post('/stageSelectedFile', function (req, res) {
  res.setHeader('Content-Type', 'text/plain');
  let clonePath = req.body.folder;
  let fileName = req.body.fileName;
  let commands = 'git add -A -- ' + fileName;
  console.log(commands);
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
app.post('/tracked', function (req, res) {
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
app.post('/unStageAll', function (req, res) {
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
app.post('/untracked', function (req, res) {
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
