const { BrowserWindow } = require('electron')
const settings = require('electron-settings')

// 350 X 510

let win = null
let isActive = false

function createWindow () {
    if (!isActive) {
        win = new BrowserWindow({
            width: 350,
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
            isActive = true
        })
        // win.webContents.openDevTools()

        win.on('closed', () => {
            isActive = false
        });
    } else {
        win.focus()
    }
}

module.exports = createWindow
