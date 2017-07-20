const {BrowserWindow, app} = require("electron")
const path = require("path")
const url = require("url")

require("electron-reload")(__dirname)

let window

function createWindow(){
window = new BrowserWindow({width: 500,
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


//window = new BrowserWindow({width: 800, height: 600})
// window = new BrowserWindow({width: 500,
//     height: 650,
//     minWidth: 350,
//     maxWidth: 650,
//     minHeight: 310,
//     resizable: false
//  })