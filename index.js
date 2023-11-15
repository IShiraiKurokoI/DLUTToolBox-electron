const {app, BrowserWindow, Menu, globalShortcut, ipcMain, clipboard} = require('electron')
const path = require('path')
const Store = require('electron-store');
Store.initRenderer()

const functions = [
    path.join(__dirname, 'monitor.html'),
    "https://sso.dlut.edu.cn/cas/login?service=http%3A%2F%2F172.20.30.2%3A8080%2FSelf%2Fsso_login%3Flogin_method%3D1",
    "https://api.m.dlut.edu.cn/oauth/authorize?client_id=19b32196decf419a&redirect_uri=https%3A%2F%2Fcard.m.dlut.edu.cn%2Fhomerj%2FopenRjOAuthPage&response_type=code&scope=base_api&state=weishao",
    "https://sso.dlut.edu.cn/cas/login?from=rj&service=https%3A%2F%2Fsso.dlut.edu.cn%2Fcas%2Flogin%3Fservice%3Dhttps%253A%252F%252Fehall.dlut.edu.cn%252Ffp%252FvisitService%253Fservice_id%253Dca2b52e6-1145-4b63-9ea9-e443b376da0d",
    "https://webvpn.dlut.edu.cn/http/57787a7876706e323032336b6579402472000514b2079f5bbe02ff3c84f58629/student/ucas-sso/login?filter=app&from=rj",
    "https://api.m.dlut.edu.cn/login?client_id=9qXqHnRQuhhViycC&redirect_uri=https%3a%2f%2flightapp.m.dlut.edu.cn%2fcheck%2fschcalendar&response_type=code&scope=base_api&state=dlut",
    "https://webvpn.dlut.edu.cn/http/57787a7876706e323032336b6579402472000514b2079f5bbe02ff3c84f58629/student/ucas-sso/login?filter=app&from=rj",
    "https://webvpn.dlut.edu.cn/http/57787a7876706e323032336b6579402472000514b2079f5bbe02ff3c84f58629/student/ucas-sso/login?filter=app&from=rj",
    "https://webvpn.dlut.edu.cn/http/57787a7876706e323032336b6579402472000514b2079f5bbe02ff3c84f58629/student/ucas-sso/login?filter=app&from=rj",
    "https://webvpn.dlut.edu.cn/http/57787a7876706e323032336b6579402472000514b2079f5bbe02ff3c84f58629/student/ucas-sso/login?filter=app&from=rj",
    "https://webvpn.dlut.edu.cn/http/57787a7876706e323032336b6579402472000514b2079f5bbe02ff3c84f58629/student/ucas-sso/login?filter=app&from=rj",
    "https://webvpn.dlut.edu.cn/http/57787a7876706e323032336b6579402472000514b2079f5bbe02ff3c84f58629/student/ucas-sso/login?filter=app&from=rj",
    "https://api.m.dlut.edu.cn/login?client_id=9qXqHnRQuhhViycC&redirect_uri=https%3a%2f%2flightapp.m.dlut.edu.cn%2fcheck%2fcourseschedule&response_type=code",
    "https://webvpn.dlut.edu.cn/http/57787a7876706e323032336b6579402472000514b2079f5bbe02ff3c84f58629/student/ucas-sso/login?filter=app&from=rj",
    "https://webvpn.dlut.edu.cn/http/57787a7876706e323032336b6579402472000514b2079f5bbe02ff3c84f58629/student/ucas-sso/login?filter=app&from=rj",
    "https://webvpn.dlut.edu.cn/http/57787a7876706e323032336b6579402472000514b2079f5bbe02ff3c84f58629/student/ucas-sso/login?filter=app&from=rj",
    "https://api.m.dlut.edu.cn/login?client_id=9qXqHnRQuhhViycC&redirect_uri=https%3a%2f%2flightapp.m.dlut.edu.cn%2fcheck%2fnotice&response_type=code&scope=base_api&state=dlut",
    "https://webvpn.dlut.edu.cn/http/57787a7876706e323032336b6579402472000514b2079f5bbe02ff3c84f58629/student/ucas-sso/login?filter=app&from=rj",
    "https://api.m.dlut.edu.cn/login?client_id=9qXqHnRQuhhViycC&redirect_uri=https%3a%2f%2flightapp.m.dlut.edu.cn%2fcheck%2femptyclassroom&response_type=code&scope=base_api&state=dlut",
    "https://sso.dlut.edu.cn/cas/login?service=https%3A%2F%2Fehall.dlut.edu.cn%2Ffp%2Fview%3Fm%3Dfp#act=fp/formProcess/graduate_student",
    "https://sso.dlut.edu.cn/cas/login?service=http%3A%2F%2Fseat.lib.dlut.edu.cn%2Fyanxiujian%2Fclient%2Flogin.php%3Fredirect%3DareaSelectSeat.php",
    "https://webvpn.dlut.edu.cn/https/57787a7876706e323032336b657940247708031bb20f9a4ce448f62d85f580230796e3c6/meta-local/opac/cas/rosetta?filter=app&from=rj",
    "https://train.lib.dlut.edu.cn/",
    "https://webvpn.dlut.edu.cn/http/57787a7876706e323032336b657940246e1d1011fa1add59ab42fc399fbc81268a6c4637b8b16a7834/?filter=app&from=rj",
    "https://webvpn.dlut.edu.cn/https/57787a7876706e323032336b657940247f561519f2059240ad48fb2c90f5862810867b93/index.html?filter=app&from=rj",
    "https://webvpn.dlut.edu.cn/https/57787a7876706e323032336b657940246f0f1556ff0d9847e442ff2c/?filter=app&from=rj",
    "https://webvpn.dlut.edu.cn/http/57787a7876706e323032336b6579402468190c56f80f865ae449fe2ddfb88b/cas?filter=app&from=rj",
    "https://mail.dlut.edu.cn/",
    "https://webvpn.dlut.edu.cn/http/57787a7876706e323032336b657940247c0d160bfd4d9742bf58b43d95aecb2487/cas?filter=app&from=rj",
    "https://webvpn.dlut.edu.cn/https/57787a7876706e323032336b657940247c0d161fef4d9742bf58b43d95aecb24b7/pyxx/LoginCAS.aspx?a=1&filter=app&from=rj",
    "https://webvpn.dlut.edu.cn/http/57787a7876706e323032336b657940247d1b030af8139257a749f42cdfbf89322e5e910d7a339f3b/?filter=app&from=rj",
    "https://webvpn.dlut.edu.cn/https/57787a7876706e323032336b657940246817100cfd0fdd4aa659ee7694bf9069de28/sso/sso_zzxt.jsp?filter=app&from=rj",
    "https://res.dlut.edu.cn/tp_cgp/view?m=cgp",
    "https://webvpn.dlut.edu.cn/http/57787a7876706e323032336b657940247a1a1149b2079f5bbe02ff3c84f58629/?filter=app&from=rj",
    "https://ehall.dlut.edu.cn/fp/s/QZMKMV?from=rj",
    "https://webvpn.dlut.edu.cn/http/57787a7876706e323032336b6579402471150d17ff4d9742bf58b43d95aecb249a/sso/dlut?filter=app&from=rj",
    "https://sso.dlut.edu.cn/cas/login?service=http%3A%2F%2Fjob.dlut.edu.cn%2FautoLogin",
    "https://webvpn.dlut.edu.cn/http/57787a7876706e323032336b657940247d081017f305dd4aa659ee7694bf90694722/sso/login.jsp?filter=app&from=rj",
]

if (process.platform === 'win32')
{
    app.setAppUserModelId("DLUTToolBox-electron");
}

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
            case 12:
                childWin.setSize(400,700)
                childWin.center()
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
                case 6:
                    if (currentURL.includes("/student/home")){
                        childWin.webContents.executeJavaScript("window.location.href='/student/for-std/course-select'")
                    }
                    if (currentURL.includes("for-std/course-select")){
                        childWin.webContents.executeJavaScript("var num=document.getElementsByClassName('get-into').length;for(i = 0; i < num; i++){document.getElementsByClassName('get-into')[i].target = '_blank'}")
                    }
                    break;
                case 7:
                    if (currentURL.includes("/student/home")){
                        childWin.webContents.executeJavaScript("window.location.href='/student/for-std/evaluation/summative'")
                    }
                    break;
                case 8:
                    if (currentURL.includes("/student/home")){
                        childWin.webContents.executeJavaScript("window.location.href='/student/for-std/exam-arrange'")
                    }
                    break;
                case 9:
                    if (currentURL.includes("/student/home")){
                        childWin.webContents.executeJavaScript("window.location.href='/student/for-std/exam-delay-apply'")
                    }
                    break;
                case 10:
                    if (currentURL.includes("/student/home")){
                        childWin.webContents.executeJavaScript("window.location.href='/student/for-std/grade/sheet'")
                    }
                    break;
                case 11:
                    if (currentURL.includes("/student/home")){
                        childWin.webContents.executeJavaScript("window.location.href='/student/for-std/course-select-apply'")
                    }
                    break;
                case 13:
                    if (currentURL.includes("/student/home")){
                        childWin.webContents.executeJavaScript("window.location.href='/student/for-std/course-table'")
                    }
                    break;
                case 14:
                    if (currentURL.includes("/student/home")){
                        childWin.webContents.executeJavaScript("window.location.href='/student/for-std/adminclass-course-table'")
                    }
                    break;
                case 15:
                    if (currentURL.includes("/student/home")){
                        childWin.webContents.executeJavaScript("window.location.href='/student/for-std/program-completion-preview'")
                    }
                    break;
                case 17:
                    if (currentURL.includes("/student/home")){
                        childWin.webContents.executeJavaScript("window.location.href='/student/for-std/lesson-search'")
                    }
                    break;
                case 27:
                    if (currentURL==="https://mail.dlut.edu.cn/"){
                        //自动切换域名
                        childWin.webContents.executeJavaScript("domain.value='mail.dlut.edu.cn';document.getElementsByClassName('domainTxt')[0].textContent = 'mail.dlut.edu.cn'")
                    }
                    break;
                case 36:
                    if (currentURL.includes("/autoLogin")){
                        //修复无权限的bug
                        childWin.webContents.executeJavaScript("window.location.href='https://job.dlut.edu.cn/login.html'")
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
