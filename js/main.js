const Store = require('electron-store');
const $ = require("jquery");
const store = new Store();
const {ipcRenderer} = require('electron')

function load_class_table(num) {
    const requestData = {
        app_key: '20460cbb2ccf1c97',
        app_secret: '1dcc14a227a6f8d9b37792b7b053f671',
        grant_type: 'client_credentials',
        scope: 'all'
    };
    // 发送POST请求
    fetch('https://api.m.dlut.edu.cn/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: Object.keys(requestData).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(requestData[key])}`).join('&')
    })
        .then(response => response.json())
        .then(data => {
            let apiUrl = `https://api.m.dlut.edu.cn/lightappapi/course/get_today_course?access_token=${data.access_token}&app_version=3.2.7.74627&domain=dlut&identity=student&platform=android&student_number=${num}`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.errcode === 0) {
                        var classTable = document.getElementById('class-table');
                        var noClassesMessage = document.getElementById('no-classes-message');
                        if (data.data.length === 0) {
                            noClassesMessage.style.display = 'block';
                        } else {
                            noClassesMessage.style.display = 'none';
                            // 遍历数据并渲染表格
                            data.data.forEach(function (item) {
                                var row = classTable.insertRow();
                                var startTimeCell = row.insertCell(0);
                                var endTimeCell = row.insertCell(1);
                                var courseNameCell = row.insertCell(2);
                                var courseAddressCell = row.insertCell(3);

                                // 设置单元格内容，去掉时间中的 ":00"
                                startTimeCell.innerHTML = item.event_begintime.slice(0, -3);
                                endTimeCell.innerHTML = item.event_endtime.slice(0, -3);
                                courseNameCell.innerHTML = item.course_name;
                                courseAddressCell.innerHTML = item.course_address;
                            });
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        })
        .catch(error => {
            console.error('Error:', error);
            return;
        });
}

function formatBytes(bytes) {
    const kb = 1024;
    const units = ['KB', 'MB', 'GB', 'TB'];
    let i = 0;
    while (bytes > kb) {
        bytes /= kb;
        i++;
    }
    return bytes.toFixed(2) + ' ' + units[i];
}

// Function to update the table with data
function updateTableForGeneral(data) {
    $('.general-network-table #onlineStatus').text(data.result === 1 ? '在线' : '离线');
    if (data.result !== 1) {
        return;
    }
    $('.general-network-table #account').text(data.uid);
    $('.general-network-table #name').text(data.NID);
    $('.general-network-table #ipAddress').text(data.v4ip);
    $('.general-network-table #macAddress').text(data.olmac.split(':').join('; '));
    $('.general-network-table #usedFlow').text(formatBytes(data.flow));
    $('.general-network-table #remainingFlow').text(formatBytes(data.olflow));
    $('.general-network-table #loginTime').text(data.etime);
}

function cleanTableForGeneral() {
    $('.general-network-table #onlineStatus').text('-');
    $('.general-network-table #account').text('-');
    $('.general-network-table #name').text('-');
    $('.general-network-table #ipAddress').text('-');
    $('.general-network-table #macAddress').text('-');
    $('.general-network-table #usedFlow').text('-');
    $('.general-network-table #remainingFlow').text('-');
    $('.general-network-table #loginTime').text('-');
}

function loadNetworkDataForGeneral() {
    $.get('http://172.20.30.1/drcom/chkstatus?callback=', function (data) {
        cleanTableForGeneral()
        data = "{" + data.split("({")[1].split("})")[0] + "}";
        data = JSON.parse(data);
        updateTableForGeneral(data);
    });
}

// Function to update the table with data
function updateTableForNetwork(data) {
    $('.network-table #_onlineStatus').text(data.result === 1 ? '在线' : '离线');
    if (data.result !== 1) {
        return;
    }
    $('.network-table #_account').text(data.uid);
    $('.network-table #_name').text(data.NID);
    $('.network-table #_ipAddress').text(data.v4ip);
    $('.network-table #_macAddress').text(data.olmac.split(':').join('; '));
    $('.network-table #_usedFlow').text(formatBytes(data.flow));
    $('.network-table #_remainingFlow').text(formatBytes(data.olflow));
    $('.network-table #_loginTime').text(data.etime);
}

function cleanTableForNetwork() {
    $('.network-table #_onlineStatus').text('-');
    $('.network-table #_account').text('-');
    $('.network-table #_name').text('-');
    $('.network-table #_ipAddress').text('-');
    $('.network-table #_macAddress').text('-');
    $('.network-table #_usedFlow').text('-');
    $('.network-table #_remainingFlow').text('-');
    $('.network-table #_loginTime').text('-');
}

function loadNetworkDataForNetwork() {
    $.get('http://172.20.30.1/drcom/chkstatus?callback=', function (data) {
        cleanTableForNetwork()
        data = "{" + data.split("({")[1].split("})")[0] + "}";
        data = JSON.parse(data);
        updateTableForNetwork(data);
    });
}

function loadEleinfo() {
    const url = 'https://api.m.dlut.edu.cn/oauth/authorize?client_id=19b32196decf419a&redirect_uri=https%3A%2F%2Fcard.m.dlut.edu.cn%2Fhomerj%2FopenRjOAuthPage&response_type=code&scope=base_api&state=weishao';

    //todo:完成电费查看
}

function clearStore(){
    store.delete("username")
    store.delete("password")
    store.delete("mail_username")
    store.delete("mail_password")
    new Notification("删除成功", {body: "所有信息已经删除"}).onclick = () => console.log("")
}

window.onload = function () {
    $('#username').val(store.get("username"))
    $('#password').val(store.get("password"))
    $('#settings').on('submit', function (event) {
        store.set('username', $('#username').val());
        store.set('password', $('#password').val());
        store.set('mail_username', $('#mail_username').val());
        store.set('mail_password', $('#mail_password').val());
        new Notification('保存成功', {body: '配置已经成功保存！'}).onclick =() => console.log("")
        event.preventDefault()
    });

    //todo:fix these two webview

    const weather = document.getElementById("weather")
    weather.addEventListener('console-message', (e) => {
        console.log('weather page log: ', e.message)
    })
    weather.addEventListener('dom-ready', (e) => {
        var currentURL = e.target.getURL();
        if (currentURL.includes("cas/login?")) {
            e.target.executeJavaScript("un.value='" + store.get("username") + "';pd.value='" + store.get("password") + "';rememberName.checked='checked';login()", false);
        }
        if (currentURL === "http://www.weather.com.cn/") {
            e.target.executeJavaScript("document.body.innerHTML=document.getElementsByClassName('myWeather')[0].outerHTML;document.getElementsByClassName('myWeatherTop')[0].outerHTML='';document.getElementsByTagName('a')[0].outerHTML='';document.body.style='overflow:hidden;background-color:transparent';document.getElementsByTagName('div')[0].style='background-color:transparent';", false);
        }
    })

    const work = document.getElementById("workframe")
    work.addEventListener('console-message', (e) => {
        console.log('work page log: ', e.message)
    })
    work.addEventListener('dom-ready', (e) => {
        var currentURL = e.target.getURL();
        if (currentURL.includes("cas/login?")) {
            e.target.executeJavaScript("un.value='" + store.get("username") + "';pd.value='" + store.get("password") + "';rememberName.checked='checked';login()", false);
        }
    })

    $(document).on('click', '.app-card', function () {
        const dataFunction = $(this).data('function');

        if (!dataFunction) {
            const dataSpecial = $(this).data('special');
            if (!dataSpecial) {
                new Notification("功能暂未实现", {body: "敬请期待"}).onclick = () => console.log("")
            }
        } else {
            ipcRenderer.send('openWindow', dataFunction)
        }
    });

    $("#RefreshNetworkStatus").on('click', function () {
        loadNetworkDataForGeneral()
        loadNetworkDataForNetwork()
        new Notification("刷新成功", {body: "校园网状态数据刷新成功！"}).onclick = () => console.log("")
    })

    $("#NetworkConnect").on('click', function () {

        ipcRenderer.on('network_login', (event, response) => {
            console.log('Response from main process:', response);
            setTimeout(loadNetworkDataForGeneral, 2000)
            setTimeout(loadNetworkDataForNetwork, 2000)
            new Notification("连接执行完成", {body: "请检查网络是否可以使用"}).onclick = () => console.log("")
        });

        $.get('http://172.20.30.1/drcom/chkstatus?callback=', async function (data) {
            data = "{" + data.split("({")[1].split("})")[0] + "}";
            data = JSON.parse(data);
            var loginURL = `https://sso.dlut.edu.cn/cas/login?service=http%3A%2F%2F172.20.30.2%3A8080%2FSelf%2Fsso_login%3Fwlan_user_ip%3D${data.v4ip}%26authex_enable%3D%26type%3D1`;
            ipcRenderer.send('network_login', loginURL);
        });
    })

    $("#NetworkDisconnect").on('click', function () {
        $.get('http://172.20.30.1/drcom/chkstatus?callback=', function (data) {
            data = "{" + data.split("({")[1].split("})")[0] + "}";
            data = JSON.parse(data);
            fetch(`http://172.20.30.1:801/eportal/portal/logout?callback=&wlan_user_ip=${data.v4ip}`)
        });
        setTimeout(loadNetworkDataForGeneral, 2000)
        setTimeout(loadNetworkDataForNetwork, 2000)
        new Notification("注销执行完成", {body: "请检查网络是否不可以使用！"}).onclick = () => console.log("")
    })

    load_class_table(store.get("username"))
    loadNetworkDataForGeneral()
    loadNetworkDataForNetwork()
};