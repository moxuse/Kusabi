var app = require("electron").app;
var BrowserWindow = require("electron").BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");
const io = require("socket.io");
const SOCKET_PORT = 9000;
const server = io.listen(SOCKET_PORT);
const childProcess = require("child_process");

const config = require("./config.json");

let mainWindow = null;

const doSpawn = () => {};

server.on("connection", socket => {
  console.log("client connected");

  const psci = childProcess.spawn(config.psciPath, ["repl"], {
    shell: true
  });
  /**
   * interaction with repl stdio
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
  socket.emit("response", "connected server on :: " + SOCKET_PORT);
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
