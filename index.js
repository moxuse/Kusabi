var app = require("electron").app;
var BrowserWindow = require("electron").BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");

var mainWindow = null;

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
