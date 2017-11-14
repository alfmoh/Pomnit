const { BrowserWindow, app } = require("electron")
const path = require("path")
const url = require("url")

const setupEvents = require('./installers/setupEvents')
 if (setupEvents.handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
 }


const filename = app.getPath('userData') + "/Pomnit.db";


var Datastore = require('nedb');
var eventData = new Datastore({
  filename: filename,
  autoload: true
});
global.eventData = eventData;

// require("electron-reload")(__dirname)

let window

function createWindow() {
  window = new BrowserWindow({
    width: 500,
    height: 650,
    minWidth: 350,
    maxWidth: 650,
    minHeight: 310,
    resizable: false
  })
  window.loadURL(url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true
  }))
}

app.on("ready", createWindow)
