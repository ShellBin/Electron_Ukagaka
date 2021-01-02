const {app, Menu, Tray, BrowserWindow} = require('electron')

function createWindow () {
    const win = new BrowserWindow({
        width: 300,
        height: 100,
        frame: false,
        maximizable: false,
        transparent: true
    })
    win.loadFile('index.html').then(() => {
        win.setSkipTaskbar(true)
        win.setAlwaysOnTop(true)
    })
}

let tray = null
app.whenReady().then(() => {
    createWindow()
    tray = new Tray('./resources/img/Tray.png')
    const contextMenu = Menu.buildFromTemplate([
        { label: '最前端显示', type: 'radio', checked: true },
        { label: '设置', type: 'normal' },
        { label: '退出', type: 'normal' }
    ])
    tray.setToolTip('运行中')
    tray.setContextMenu(contextMenu)

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})