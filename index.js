const config = require("./config.json");
const app = require("electron").app;

const BrowserWindow = require("electron").BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const io = require("socket.io");
const server = io.listen(config.replSocketPort);
const childProcess = require("child_process");

let mainWindow = null;
console.log("load config:", config);

const doSpawn = () => {};

server.on("connection", socket => {
  console.log("client connected");

  const psci = childProcess.spawn(
    config.psciCommand,
    [
      config.psciOptions[0],
      "--",
      config.psciOptions[1],
      "--port " + config.psciPort
    ],
    {
      cwd: config.yodakaPath,
      shell: true
    }
  );
  /**
   * interaction with repl stdio
   * TODO: Want add repl process like: https://github.com/tidalcycles/atom-tidalcycles/blob/master/lib/repl.js#L54
   */
  psci.stdout.setEncoding("utf-8");
  psci.stdout.on("data", data => {
    socket.emit("response", data);
  });
  psci.stderr.setEncoding("utf-8");
  psci.stderr.on("data", data => {
    console.log(data);
    socket.emit("response", data);
  });
  /**
   * interaction with editor of render process
   */
  socket.emit("response", "connected server on :: " + config.replSocketPort);
  socket.on("repl", msg => {
    console.log("on exec repl...", msg);
    psci.stdin.write(msg + "\n");
  });
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
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "/dist/index.html")}`
  );

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
});
