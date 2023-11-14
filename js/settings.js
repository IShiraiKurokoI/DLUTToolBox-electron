const Store = require('electron-store');
const $ = require("jquery");
const store = new Store();

window.onload = function() {
    $('#username').value=store.get("username")
    $('#password').value=store.get("password")
    $('#settings').on('submit', function(event) {
        event.preventDefault()
        store.set('username', $('#username').val());
        store.set('password', $('#password').val());
        const NOTIFICATION_TITLE = '保存成功'
        const NOTIFICATION_BODY = '配置已经成功保存！'
        new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY }).onclick =
            () => console.log("")
    });
};