const Store = require('electron-store');
const store = new Store();
$('#settings').on('submit', function(event) {
    event.preventDefault()
    store.set('username', $('#username').val());
    store.set('password', $('#password').val());
    const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById('Toast'))
    toast.show()
});