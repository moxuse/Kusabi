const config = require("./config.json");
const app = require("electron").app;

const BrowserWindow = require("electron").BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const io = require("socket.io");
const server = io.listen(config.replSocketPort);
const exec = require("child_process").exec;
const { watch } = require("fs");
const fs = require("fs");
const appendFile = require("fs").appendFile;

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
const bundleCompileFile = code => {
  cleanMain();
  prapareFile();
  const addingCode = code + "\n";
  appendFile(mainFile, addingCode, err => {
    if (err) throw err;
    console.log("Writen Main Correctly");
  });
};

const prapareFile = () => {
  exec("cat " + bundleFile + " >> " + mainFile, (error, stdout, stderr) => {
    if (error) {
      console.log("Write File Error", error);
    }
  });
};

const cleanMain = () => {
  exec('echo " " > ' + mainFile, (error, stdout, stderr) => {
    if (error) {
      console.log("Write File Error", error);
      return;
    }
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

  socket.on("repl", code => {
    cleanMain();
    console.log("build psci > ", code);
    doCompile(socket, code)
      .then(() => {
        // psci.stdin.write(msg + "\n");
        const resultCode = fs.readFileSync(targetFile, { encodeing: "utf8" });
        socket.emit("response", resultCode);
        cleanMain();
      })
      .catch(e => {
        cleanMain();
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
});

app.on("window-all-closed", function() {
  if (process.platform != "darwin") {
    app.quit();
  }
});

app.on("ready", function() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 1080
    // titleBarStyle: "hidden"/
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:" + config.kusabiPort
      : `file://${path.join(__dirname, "/dist/index.html")}`
  );

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
});
