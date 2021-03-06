const config = require("./config.json");
const app = require("electron").app;
const electron = require("electron");
const Menu = electron.Menu;

const BrowserWindow = require("electron").BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const io = require("socket.io");
const server = io.listen(config.replSocketPort);
const util = require('util');
const childProcess = require("child_process");
const exec = util.promisify(childProcess.exec);
const fs = require("fs");
const appendFile = require("fs").appendFile;
const OscServer = require("node-osc").Server;


let mainWindow = null;

console.log("load config:", config);

const targetFile = path.join(
  __dirname,
  "/" + config.yodakaPath + "/" + config.spagoOptions.targetFile
);
const bundleFile = path.join(
  __dirname,
  "/" + "./" + config.yodakaPath + "/" + config.spagoOptions.bundlePath
);
const mainFile = path.join(
  __dirname,
  "/" + "./" + config.yodakaPath + "/" + config.spagoOptions.mainPath + ".purs"
);
try {
  fs.statSync(targetFile);
} catch (err) {
  if (err.code === "ENOENT") {
    exec("touch " + targetFile, (error, stdout, stderr) => {
      if (error) {
        socket.emit("responseError", "File Preraring Error.");
      }
    });
  }
}
// const doSpawn = () => {
//   psci = childProcess.spawn(
//     config.psciCommand,
//     [
//       config.psciOptions[0],
//       "--",
//       config.psciOptions[1],
//       "--port " + config.psciPort
//     ],
//     {
//       cwd: config.yodakaPath,
//       shell: true
//     }
//   );
// };

console.log("Yodaka dir", path.join(process.cwd(), "/" + config.yodakaPath));
const bundleCompileFile = async code => {
  await prapareFile();
  const indented = indentation(code);
  const addingCode = indented + "\n";
  appendFile(mainFile, addingCode, err => {
    if (err) throw err;
    console.log("Writen Main Correctly");
  });
};

const prapareFile = async () => {
  return new Promise (resolve => {
  exec("cat " + bundleFile + " >> " + mainFile, (error, stdout, stderr) => {
    if (error) {
      console.log("Write File Error", error);
    }
    resolve();
    });
  });
};

const cleanMain = async () => {
  new Promise (resolve => {
   exec('echo " " > ' + mainFile, (error, stdout, stderr) => {
    if (error) {
      console.log("Write File Error", error);
      return;
    }
    resolve();
    });
  });
};

const doCompile = (socket, code) => {
  return new Promise((resolve, reject) => {
    bundleCompileFile(code);
    const opts = {
      cwd: path.join(process.cwd(), "/" + config.yodakaPath)
    };
    const command = config.spagoCommand;
    exec(command, opts, (error, stdout, stderr) => {
      if (error) {
        console.error(`Compile error:: ${error}`);
        socket.emit("responseError", "Compile Error with :: " + error);
        return reject(error);
      }
      resolve();
    });
  });
};

const indentation = text => {
  let text_ = text.split("\n");
  let splited = ["  \n"].concat(text_);
  const final = splited.reduce((p, c, i) => {
    if (i == 0) {
      return p.concat(c + "\n");
    } else {
      return p.concat("  " + c + "\n");
    }
  });
  return final;
};

/**
 * socket io
 */
server.on("connection", socket => {
  console.log("client connected");
  /**
   * interaction with repl stdio
   * TODO: Want add repl process like: https://github.com/tidalcycles/atom-tidalcycles/blob/master/lib/repl.js#L54
   *
   * We do spago build here. We want to eveluate code in psci directly in the future.
   * Now we can't evaluate multi-line code from outside of our console App.
   * see: https://github.com/purescript/purescript/issues/934
   */

  socket.on("repl", async code => {
    await cleanMain();
    console.log("build psci > ", code);
    doCompile(socket, code)
      .then(() => {
        // psci.stdin.write(msg + "\n");
        const resultCode = fs.readFileSync(targetFile, { encodeing: "utf8" });
        socket.emit("response", resultCode);
      })
      .catch(e => {
        console.log("Failed compiling :: ", e);
      });
  });

  // psci.stdout.setEncoding("utf-8");
  // psci.stdout.on("data", data => {
  //   console.log("on DATA", data);
  //   if (data.indexOf("PSCi, ") >= 0) {
  //     socket.emit("replLoaded");
  //   }
  //   socket.emit("response", data);
  // });
  // psci.stderr.setEncoding("utf-8");
  // psci.stderr.on("data", data => {
  //   console.log(data);
  //   socket.emit("response", data);
  // });
  /**
   * interaction with editor of render process
   */

  console.log("sthart watching Main.purs");

  /**]
   * osc listen
   */
  const oscServer = new OscServer(config.osc.port, config.osc.host);
  oscServer.on("message", function(msg) {
    // console.log("on osc msg:", msg);
    socket.emit(msg[0], msg[1]);
  });
});

const exportWeb = () => {
  exec("npm run export", (error, stdout, stderr) => {
    if (error) {
      socket.emit("Error", "Web Exporting Error.");
    }
    console.log("Exported..");
    if (process.platform==='darwin') { exec("open ./dist") }
  });
}

/**
 * menu settings
 */
const initWindowMenu = () => {
  const template = [
      {
          label: 'Menu',
          submenu: [
              {
                  label: 'Quit',
                  click () { app.quit(); }
              }
          ]
      },
      {
        label: 'File',
        submenu: [
            {
                label: 'Export',
                click () { exportWeb() }
            }
        ]
    }
  ]
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.on("window-all-closed", function() {
  if (process.platform != "darwin") {
    app.quit();
  }
});

app.on("ready", function() {
  mainWindow = new BrowserWindow({
    width: config.editor.windowWidth,
    height: config.editor.windowHeight,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
    // titleBarStyle: "hidden"/
  });

  initWindowMenu();

  app.toggleMenubar = function() {
    mainWindow.setMenuBarVisibility(!mainWindow.isMenuBarVisible());
  };

  app.toggleFullscreen = function() {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
  };

  mainWindow.loadURL(
    isDev
      ? "http://localhost:" + config.kusabiPort
      : `file://${path.join(__dirname, "/dist/index.html")}`
  );

  mainWindow.on("closed", function() {
    mainWindow = null;
    app.quit();
  });
});
