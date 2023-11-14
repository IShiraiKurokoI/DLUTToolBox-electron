const { app, BrowserWindow, Menu} = require('electron')
const path = require('path')

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1360,
        height: 720,
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false
        }
    })

    mainWindow.loadFile(path.join(__dirname, 'index.html'))
    const template = [
        {
            label: '强制刷新',
            role: 'forceReload' // 强制刷新页面
        },{
        label: '开发者工具',
        click: () => {
            mainWindow.webContents.openDevTools({ mode: 'detach' }); // 使用detach模式
        }
    }]
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
