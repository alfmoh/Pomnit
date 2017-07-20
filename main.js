const {BrowserWindow, app} = require("electron")
const path = require("path")
const url = require("url")

let window

function createWindow(){
  window = new BrowserWindow({width: 800, height: 600})
  window.loadURL(url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true
  }))
}

app.on("ready", createWindow)