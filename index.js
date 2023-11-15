const {app, BrowserWindow, Menu, globalShortcut, ipcMain} = require('electron')
const path = require('path')
const Store = require('electron-store');
Store.initRenderer()

const functions = [
    path.join(__dirname, 'monitor.html'),
    ""
]

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1360,
        height: 720,
        icon: path.join(__dirname, 'icon.ico'),
        thickFrame: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false,
            contextIsolation: false,
            nodeIntegration: true,
            enableRemoteModule: true,
            webviewTag: true,
            experimentalFeatures: true
        }
    })

    mainWindow.loadFile(path.join(__dirname, 'index.html'))

    Menu.setApplicationMenu(null)

    globalShortcut.register('CommandOrControl+F12', () => {
        mainWindow.webContents.openDevTools({mode: 'detach'});
    });
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    ipcMain.on('openWindow', (event, arg) => {
        const childWin = new BrowserWindow({
            width: 1360,
            height: 720,
            icon: path.join(__dirname, 'icon.ico'),
            thickFrame: true,
            webPreferences: {
                webSecurity: false,
                contextIsolation: false,
                nodeIntegration: true,
                enableRemoteModule: true,
                webviewTag: true,
                experimentalFeatures: true
            }
        })
        var funcnum = arg -1;
        console.log(`load page:${functions[funcnum]}`)
        childWin.loadURL(functions[funcnum])
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
