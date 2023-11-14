const Store = require('electron-store');
const $ = require("jquery");
const store = new Store();

window.onload = function() {
    $('#username').val(store.get("username"))
    $('#password').val(store.get("password"))
    $('#settings').on('submit', function(event) {
        store.set('username', $('#username').val());
        store.set('password', $('#password').val());
        const NOTIFICATION_TITLE = '保存成功'
        const NOTIFICATION_BODY = '配置已经成功保存！'
        new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY }).onclick =
            () => console.log("")

        event.preventDefault()
    });


    const workframe = $("#workframe")
    workframe.on('did-navigate', function (event) {
        const currentURL = workframe[0].getURL();
        if (currentURL.includes("/cas/login?")){
            workframe[0].executeJavaScript("un.value='" + store.get("username") + "';pd.value='" + store.get("password") + "';rememberName.checked='checked';login()",false);
        }
    });
};