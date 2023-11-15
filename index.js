const {app, BrowserWindow, Menu, globalShortcut, ipcMain, clipboard} = require('electron')
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
        });

        // 加载页面
        var funcnum = arg - 1;
        console.log(`load page:${functions[funcnum]}`);
        childWin.loadURL(functions[funcnum]);

        // 创建菜单
        const template = [
            {
                label: '前进',
                click: () => {
                    if (childWin.webContents.canGoForward()) {
                        childWin.webContents.goForward();
                    }
                }
            },
            {
                label: '后退',
                click: () => {
                    if (childWin.webContents.canGoBack()) {
                        childWin.webContents.goBack();
                    }
                }
            },
            {
                label: '刷新',
                click: () => {
                    childWin.webContents.reload();
                }
            },
            {
                label: '复制当前链接',
                click: () => {
                    const currentURL = childWin.webContents.getURL();
                    clipboard.writeText(currentURL);
                    //TODO: Notification
                }
            },
            {
                label: '开发者工具',
                click: () => {
                    childWin.webContents.openDevTools();
                }
            }
        ];

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    });


})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
