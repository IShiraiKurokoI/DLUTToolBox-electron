const {app, BrowserWindow, Menu, globalShortcut, ipcMain, clipboard} = require('electron')
const path = require('path')
const Store = require('electron-store');
Store.initRenderer()

const functions = [
    path.join(__dirname, 'monitor.html'),
    "https://sso.dlut.edu.cn/cas/login?service=http%3A%2F%2F172.20.30.2%3A8080%2FSelf%2Fsso_login%3Flogin_method%3D1",
    "https://api.m.dlut.edu.cn/oauth/authorize?client_id=19b32196decf419a&redirect_uri=https%3A%2F%2Fcard.m.dlut.edu.cn%2Fhomerj%2FopenRjOAuthPage&response_type=code&scope=base_api&state=weishao"
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
            experimentalFeatures: true,
            webPreferences:{
                partition:"browser_window"
            },
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

    //处理校园网登陆
    ipcMain.on('network_login', (event, loginURL) => {
        const store = new Store();
        const childWin = new BrowserWindow({
            width: 200,
            height: 100,
            show:false,
            webPreferences:{
                partition:"network_login"
            },
            icon: path.join(__dirname, 'icon.ico'),
            thickFrame: true
        });

        childWin.webContents.on('did-finish-load', () => {
            const currentURL = childWin.webContents.getURL();
            if (currentURL.includes("/cas/login?")) {
                childWin.webContents.executeJavaScript("un.value='" + store.get("username") + "';pd.value='" + store.get("password") + "';rememberName.checked='checked';login()");
            }
            if (currentURL.includes("/Self/dashboard")) {
                childWin.webContents.session.clearStorageData([],function (data) {
                    console.log(data);
                })
                event.sender.send('network_login', "login done");
                childWin.close()
            }
        });

        childWin.loadURL(loginURL);
        childWin.setMenu(null);
    });

    //服务窗口
    ipcMain.on('openWindow', (event, arg) => {
        const store = new Store();
        const childWin = new BrowserWindow({
            width: 1360,
            height: 720,
            icon: path.join(__dirname, 'icon.ico'),
            thickFrame: true
        });
        var funcnum = arg - 1;
        //特殊设置
        switch (funcnum){
            case 2:
                childWin.setSize(400,700)
                childWin.center()
                childWin.webContents.userAgent="Mozilla/5.0 (Linux; Android 10; EBG-AN00 Build/HUAWEIEBG-AN00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36 weishao(3.2.2.74627)"
                break;
            default:
                break;
        }
        childWin.webContents.on('did-finish-load', () => {
            // 获取当前页面的URL
            const currentURL = childWin.webContents.getURL();
            console.log(`[Browser Page]Loaded page:${currentURL}`);
            //自动登录
            if (currentURL.includes("/cas/login?")) {
                childWin.webContents.executeJavaScript("un.value='" + store.get("username") + "';pd.value='" + store.get("password") + "';rememberName.checked='checked';login()");
            }
            if (currentURL.includes("api.m.dlut.edu.cn/login?")){
                childWin.webContents.executeJavaScript("username.value='" + store.get("username") + "';password.value='" + store.get("password") + "';btnpc.disabled='';btnpc.click()");
            }
            //特殊处理
            switch (funcnum){
                case 2:
                    if (currentURL.includes("https://card.m.dlut.edu.cn/virtualcard/openVirtualcard?")){
                        childWin.webContents.executeJavaScript("document.getElementsByClassName('code')[0].className=''")
                    }
                    break;
                default:
                    break;
            }
        });
        // 加载页面
        console.log(`[Browser Page]Load page:${functions[funcnum]}`);
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
        childWin.setMenu(menu)
    });
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
