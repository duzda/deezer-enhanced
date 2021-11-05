const { ipcRenderer } = require("electron");

function setVisualCheckbox(variable, label) {
    if (variable == 'true') {
        label.classList.add('is-checked');
    } else {
        label.classList.remove('is-checked');
    }
}

function setVisualTextbox(variable, input) {
    if (variable) {
        input.setAttribute('value', variable);
    }
}

function initializeSettingsStates() {
    ipcRenderer.invoke("requestSettings").then((data) => {
        setVisualCheckbox(data.enableTray, enableTrayLabel);
        setVisualCheckbox(data.closeToTray, closeToTrayLabel);
        setVisualCheckbox(data.optimizeApp, optimizeAppLabel);
        setVisualCheckbox(data.songNotifications, songNotificationsLabel);
        setVisualTextbox(data.volumePower, inputVolumePower);
        setVisualTextbox(data.downloadLimit, inputDownloadSpeed);
    });
}

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

initializeSettingsStates();

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

// Cache

let clearCacheButton = document.getElementById('clearCache');

clearCacheButton.addEventListener('click', function(e) {
    ipcRenderer.send("clearCache");
    document.getElementById('cache-popup').style.display = '';

    setTimeout(() => {
        document.getElementById('cache-popup').style.display = 'none';
    }, 3000)
})

// Reset settings

let resetSettingsButton = document.getElementById('resetSettings');

resetSettingsButton.addEventListener('click', function(e) {
    ipcRenderer.send("resetSettings");
    initializeSettingsStates();
})