const { ipcRenderer } = require("electron");

// Helpers - Visuals

function setVisualSwitch(variable, label) {
    if (variable == 'true') {
        label.classList.add('is-checked');
    } else {
        label.classList.remove('is-checked');
    }
}

function setVisualTextbox(variable, input) {
    if (typeof variable !== 'undefined') {
        input.value = variable;
    }
}

// Helpers - Invokers

function invokeSwitch(variable, label) {
    ipcRenderer.send("setSetting", variable,
        label.classList.contains('is-checked') ? "true" : "false");
}

function invokeInput(variable, input) {
    input.setAttribute('value', input.value);
    ipcRenderer.send("setSetting", variable,
        input.value);
}

// Initialize all visuals

function initializeSettingsStates() {
    ipcRenderer.invoke("requestSettings").then((data) => {
        setVisualSwitch(data.enableTray, enableTrayLabel);
        setVisualSwitch(data.closeToTray, closeToTrayLabel);
        setVisualSwitch(data.optimizeApp, optimizeAppLabel);
        setVisualSwitch(data.songNotifications, songNotificationsLabel);
        setVisualTextbox(data.volumePower, inputVolumePower);
        setVisualTextbox(data.downloadLimit, inputDownloadSpeed);
    });
}

// Initialize all callbacks

function invokeAllCallbacks() {
    invokeSwitch("enableTray", enableTrayLabel);
    invokeSwitch("closeToTray", closeToTrayLabel);
    invokeSwitch("optimizeApp", optimizeAppLabel);
    invokeSwitch("songNotifications", songNotificationsLabel);
    invokeInput("volumePower", inputVolumePower);
    invokeInput("downloadLimit", inputDownloadSpeed);
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

// All the settings... Yes, you must bind it to input, otherwise function gets called twice!
enableTrayLabel.getElementsByTagName('input')[0].addEventListener('click', function (e) {
    invokeSwitch("enableTray", enableTrayLabel);
});
closeToTrayLabel.getElementsByTagName('input')[0].addEventListener('click', function (e) {
    invokeSwitch("closeToTray", closeToTrayLabel);
});
optimizeAppLabel.getElementsByTagName('input')[0].addEventListener('click', function (e) {
    invokeSwitch("optimizeApp", optimizeAppLabel);
});
songNotificationsLabel.getElementsByTagName('input')[0].addEventListener('click', function (e) {
    invokeSwitch("songNotifications", songNotificationsLabel);
});
inputVolumePower.addEventListener('blur', function (e) {
    invokeInput("volumePower", inputVolumePower);
});
inputDownloadSpeed.addEventListener('blur', function (e) {
    invokeInput("downloadLimit", inputDownloadSpeed);
});

initializeSettingsStates();

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

    setTimeout(() => {
        invokeAllCallbacks();
    }, 100);
})