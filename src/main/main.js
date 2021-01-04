const { app, Menu, Tray, BrowserWindow } = require('electron')
const settings = require('electron-settings')

const settingPanel = require('./setting')

let win = null
let tray = null
let settingBase = { lastTimeRun: null, onTopDisplay: false }

function createWindow () {
    win = new BrowserWindow({
        width: 300,
        height: 100,
        frame: false,
        maximizable: false,
        transparent: true
    })
    win.loadFile(__dirname + '/../renderer/index.html').then(() => {
        win.setSkipTaskbar(true)
        checkSettings()
    })
}

function checkSettings() {
    settings.has('lastTimeRun').then((value) => {
        if (!value) {
            // First time run
            settingBase.lastTimeRun = new Date()
            settings.set(settingBase).then(() => {
                applyCurrentSettings()
            })
        } else {
            // Second time run
            settings.get().then((value) => {
                settingBase = value
                applyCurrentSettings()
            })
        }
    })
}

function applyCurrentSettings() {
    // Set tray
    setTray()
    // Set always on top
    win.setAlwaysOnTop(settingBase.onTopDisplay)
}

async function saveSettings() {
    settingBase.lastTimeRun = new Date()
    return settings.set(settingBase).then(() => {
        return 'success'
    })
}

function setTray() {
    tray = new Tray(__dirname + '/resources/img/Tray.png')
    let contextMenu = Menu.buildFromTemplate([
        { label: '最前端显示', type: 'checkbox', checked: settingBase.onTopDisplay, click: () => { switchOnTopDisplay()} },
        { label: '设置', type: 'normal', click: () => { openSettingPanel()} },
        { label: '退出', type: 'normal', click: () => { saveSettings().then((result) => { if (result === 'success') app.quit() })} }
    ])
    tray.setToolTip('运行中')
    tray.setContextMenu(contextMenu)
    tray.on('click', () => {
        win.focus()
    })
}

function switchOnTopDisplay() {
    settingBase.onTopDisplay = !settingBase.onTopDisplay
    settings.set(settingBase).then(() => {
        win.setAlwaysOnTop(settingBase.onTopDisplay)
    })
}

function openSettingPanel() {
    settingPanel.creat()
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    saveSettings().then((result) => {
        if (result==='success') {
            if (process.platform !== 'darwin') {
                app.quit()
            }
        }
    })
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})