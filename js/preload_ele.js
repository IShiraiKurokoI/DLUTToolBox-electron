const { contextBridge,ipcRenderer } = require('electron')

window.my_postMessage=function (message){
    ipcRenderer.send("message",message)
}

contextBridge.exposeInMainWorld(
    'electronApi', {
        post: window.my_postMessage
    }
);