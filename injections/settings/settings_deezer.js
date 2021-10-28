const { ipcRenderer } = require("electron");

// Create animations
let content = document.getElementById('page_content');
if (content != null) {
    let inputs = content.getElementsByClassName('input-switch');
    for (let i = 0, len = inputs.length; i < len; i++) {
        inputs[i].addEventListener('click', function (e) {
            let node = e.target;
            node.classList.toggle('is-checked');
        });
    }
}

// Initialize values based on settings
let enableTrayLabel = document.getElementById('enableTray');
let closeToTrayLabel = document.getElementById('closeToTray');
let optimizeAppLabel = document.getElementById('optimizeApp');
let songNotificationsLabel = document.getElementById('songNotifications');
let inputVolumePower = document.getElementById('volumePower')
let inputDownloadSpeed = document.getElementById('downloadLimit')

ipcRenderer.invoke("requestSettings").then((data) => {
    if (data.enableTray == 'true') {
        enableTrayLabel.classList.add('is-checked');
    }
    if (data.closeToTray == 'true') {
        closeToTrayLabel.classList.add('is-checked');
    } 
    if (data.optimizeApp == 'true') {
        optimizeAppLabel.classList.add('is-checked');
    }
    if (data.songNotifications == 'true') {
        songNotificationsLabel.classList.add('is-checked');
    }
    if (data.volumePower) {
        inputVolumePower.setAttribute('value', data.volumePower);
    }
    if (data.downloadLimit) {
        inputDownloadSpeed.setAttribute('value', data.downloadLimit);
    }
});

// All the settings... Yes, you must bind it to input, otherwise function gets called twice!
enableTrayLabel.getElementsByTagName('input')[0].addEventListener('click', function (e) {
    ipcRenderer.send("setSetting", "enableTray",
        enableTrayLabel.classList.contains('is-checked') ? "true" : "false");
});
closeToTrayLabel.getElementsByTagName('input')[0].addEventListener('click', function (e) {
    ipcRenderer.send("setSetting", "closeToTray",
        closeToTrayLabel.classList.contains('is-checked') ? "true" : "false");
});
optimizeAppLabel.getElementsByTagName('input')[0].addEventListener('click', function (e) {
    ipcRenderer.send("setSetting", "optimizeApp",
        optimizeAppLabel.classList.contains('is-checked') ? "true" : "false");
});
songNotificationsLabel.getElementsByTagName('input')[0].addEventListener('click', function (e) {
    ipcRenderer.send("setSetting", "songNotifications",
        songNotificationsLabel.classList.contains('is-checked') ? "true" : "false");
});
inputVolumePower.addEventListener('blur', function (e) {
    ipcRenderer.send("setSetting", "volumePower",
        inputVolumePower.value);
});
inputDownloadSpeed.addEventListener('blur', function (e) {
    ipcRenderer.send("setSetting", "downloadLimit",
        inputDownloadSpeed.value);
});
