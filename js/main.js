const Store = require('electron-store');
const $ = require("jquery");
const store = new Store();
const {ipcRenderer} = require('electron')
const path = require("path");

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
    if(!data.v4ip){
        $('.network-table #_ipAddress').text(data.v46ip);
    }
    if (data.result !== 1) return;
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
    if(!data.v4ip){
        $('.network-table #_ipAddress').text(data.v46ip);
    }
    if (data.result !== 1) return;
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

function loadEleinfo(notification) {
    var ele = $(".eleinfo")
    ele.empty()
    ele.append("<p>正在加载电费数据。。。。</p>")
    ipcRenderer.on('query_eleinfo', (event, response) => {
        ele.empty()
        ele.append("<div>您当前寝室电费数据为：</div>")
        try {
            if (parseFloat(response)<0){
                ele.append(`<span class='badge text-bg-danger'>${response}</span>`)
                ele.append(`<div>⚠电费余额已经耗尽，请立即充值！⚠</div>`)
            }else if (parseFloat(response)<10){
                ele.append(`<span class='badge text-bg-warning'>${response}</span>`)
                ele.append(`<div>⚠电费余额即将耗尽，请及时充值！⚠</div>`)
            }else if (response!=="⚠当前不在电费查询时间段⚠"){
                ele.append(`<span class='badge text-bg-success'>${response}</span>`)
                ele.append(`<div>电费余额较为充足，请放心使用。</div>`)
            }else {
                ele.append(`<span class='badge text-bg-info'>${response}</span>`)
            }
        }catch (e){
            ele.append(`<span class='badge text-bg-primary'>${response}</span>`)
        }

        if (notification){
            new Notification("刷新成功", {
                icon: path.join(__dirname, 'icon.ico'),
                body: "电费信息已经成功刷新！"
            }).onclick = () => console.log("")
        }
    });
    ipcRenderer.send('query_eleinfo');
}

function clearStore() {
    store.delete("username")
    store.delete("password")
    store.delete("mail_username")
    store.delete("mail_password")
    new Notification("删除成功", {
        icon: path.join(__dirname, 'icon.ico'),
        body: "所有信息已经删除"
    }).onclick = () => console.log("")
}

window.onload = function () {
    $('#username').val(store.get("username"))
    $('#password').val(store.get("password"))
    $('#mail_username').val(store.get("mail_username"))
    $('#mail_password').val(store.get("mail_password"))
    $('#settings').on('submit', function (event) {
        store.set('username', $('#username').val());
        store.set('password', $('#password').val());
        store.set('mail_username', $('#mail_username').val());
        store.set('mail_password', $('#mail_password').val());
        new Notification('保存成功', {
            icon: path.join(__dirname, 'icon.ico'),
            body: '配置已经成功保存！'
        }).onclick = () => console.log("")
        event.preventDefault()
    });

    $(document).on('click', '.app-card', function () {
        const dataFunction = $(this).data('function');

        if (!dataFunction) {
            const dataSpecial = $(this).data('special');
            if (!dataSpecial) {
                new Notification("功能暂未实现", {
                    icon: path.join(__dirname, 'icon.ico'),
                    body: "敬请期待"
                }).onclick = () => console.log("")
            }
        } else {
            ipcRenderer.send('openWindow', dataFunction)
        }
    });

    $("#RefreshNetworkStatus").on('click', function () {
        loadNetworkDataForGeneral()
        loadNetworkDataForNetwork()
        new Notification("刷新成功", {
            icon: path.join(__dirname, 'icon.ico'),
            body: "校园网状态数据刷新成功！"
        }).onclick = () => console.log("")
    })

    $("#NetworkConnect").on('click', function () {

        ipcRenderer.on('network_login', (event, response) => {
            console.log('Response from main process:', response);
            setTimeout(loadNetworkDataForGeneral, 2000)
            setTimeout(loadNetworkDataForNetwork, 2000)
            new Notification("连接执行完成", {
                icon: path.join(__dirname, 'icon.ico'),
                body: "请检查网络是否可以使用"
            }).onclick = () => console.log("")
        });

        $.get('http://172.20.30.1/drcom/chkstatus?callback=', async function (data) {
            data = "{" + data.split("({")[1].split("})")[0] + "}";
            data = JSON.parse(data);
            let loginURL = `https://sso.dlut.edu.cn/cas/login?service=http%3A%2F%2F172.20.30.2%3A8080%2FSelf%2Fsso_login%3Fwlan_user_ip%3D${data.v4ip}%26authex_enable%3D%26type%3D1`;
            if (!data.v4ip){
                loginURL = `https://sso.dlut.edu.cn/cas/login?service=http%3A%2F%2F172.20.30.2%3A8080%2FSelf%2Fsso_login%3Fwlan_user_ip%3D${data.v46ip}%26authex_enable%3D%26type%3D1`;
            }
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
        new Notification("注销执行完成", {
            icon: path.join(__dirname, 'icon.ico'),
            body: "请检查网络是否不可以使用！"
        }).onclick = () => console.log("")
    })

    $("#RefreshEleinfo").on('click', function () {
        loadEleinfo(true)
    })

    load_class_table(store.get("username"))
    loadNetworkDataForGeneral()
    loadNetworkDataForNetwork()
    loadEleinfo(false)
};

document.getElementById('workframe').addEventListener('console-message', (e) => {
    console.log('work page log: ', e.message)
})
document.getElementById('workframe').addEventListener('did-finish-load', (e) => {
    var currentURL = document.getElementById('workframe').getURL()
    console.warn(currentURL)
    if (currentURL.includes("cas/login?")) {
        document.getElementById('workframe').executeJavaScript("un.value='" + store.get("username") + "';pd.value='" + store.get("password") + "';rememberName.checked='checked';login()", false);
    }
})

document.getElementById('weather').addEventListener('console-message', (e) => {
    console.log('weather page log: ', e.message)
})
document.getElementById('weather').addEventListener('did-finish-load', (e) => {
    var currentURL = document.getElementById('weather').getURL()
    console.warn(currentURL)
    if (currentURL.includes("cas/login?")) {
        document.getElementById('weather').executeJavaScript("un.value='" + store.get("username") + "';pd.value='" + store.get("password") + "';rememberName.checked='checked';login()", false);
    }
    if (currentURL === "http://www.weather.com.cn/") {
        document.getElementById('weather').executeJavaScript("document.body.innerHTML=document.getElementsByClassName('myWeather')[0].outerHTML;document.getElementsByClassName('myWeatherTop')[0].outerHTML='';document.getElementsByTagName('a')[0].outerHTML='';document.body.style='overflow:hidden;background-color:transparent';document.getElementsByTagName('div')[0].style='background-color:transparent';", false);
    }
})