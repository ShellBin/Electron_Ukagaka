const { BrowserWindow } = require('electron')
const settings = require('electron-settings')

// 700 X 510

let win = null

function createWindow () {
    win = new BrowserWindow({
        width: 700,
        height: 510,
        frame: false,
        resizable: false,
        useContentSize: false,
        transparent: true,
        webPreferences: {
            contextIsolation: true
        }
    })
    win.loadFile(__dirname + '/../../renderer/setting/index.html').then(() => {

    })
}

module.exports = createWindow
