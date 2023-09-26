/* global ipcRenderer */

// Helpers - Visuals

function setVisualSwitch(variable, label) {
    const span = label.parentElement.getElementsByTagName('label')[1].getElementsByTagName('span')[0];
    const innerSpan = span.getElementsByTagName('span')[0];
    if (variable == 'true') {
        label.dataset.checked = '';
        span.dataset.checked = '';
        innerSpan.dataset.checked = '';
    } else {
        delete label.dataset.checked;
        delete span.dataset.checked;
        delete innerSpan.dataset.checked;
    }
}

function setVisualTextbox(variable, input) {
    if (typeof variable !== 'undefined') {
        input.value = variable;
    }
}

// Helpers - Invokers

function invokeSwitch(variable, label) {
    setVisualSwitch(label.dataset.checked === undefined ? 'true' : 'false', label);
    ipcRenderer.send('setSetting', variable, label.dataset.checked !== undefined ? 'true' : 'false');
}

function invokeInput(variable, input) {
    input.setAttribute('value', input.value);
    ipcRenderer.send('setSetting', variable, input.value);
}

// Initialize all visuals

function initializeSettingsStates() {
    ipcRenderer.invoke('requestSettings').then((data) => {
        setVisualSwitch(data.enableTray, enableTrayLabel);
        setVisualSwitch(data.closeToTray, closeToTrayLabel);
        setVisualSwitch(data.optimizeApp, optimizeAppLabel);
        setVisualSwitch(data.songNotifications, songNotificationsLabel);
        setVisualSwitch(data.deemixIntegration, deemixIntegrationLabel);
        setVisualSwitch(data.discordRPC, discordRPCLabel);
        setVisualTextbox(data.volumePower, inputVolumePower);
        setVisualTextbox(data.downloadLimit, inputDownloadSpeed);
        setVisualTextbox(data.webPort, inputWebPort);
    });
}

// Initialize values based on settings
const enableTrayLabel = document.getElementById('enableTray');
const closeToTrayLabel = document.getElementById('closeToTray');
const optimizeAppLabel = document.getElementById('optimizeApp');
const songNotificationsLabel = document.getElementById('songNotifications');
const deemixIntegrationLabel = document.getElementById('deemixIntegration');
const discordRPCLabel = document.getElementById('discordRPC');
const inputVolumePower = document.getElementById('volumePower');
const inputDownloadSpeed = document.getElementById('downloadLimit');
const inputWebPort = document.getElementById('webPort');

// All the settings... Yes, you must bind it to input, otherwise function gets called twice!
enableTrayLabel.parentElement.getElementsByTagName('label')[1].getElementsByTagName('input')[0].addEventListener('click', function () {
    invokeSwitch('enableTray', enableTrayLabel);
});
closeToTrayLabel.parentElement.getElementsByTagName('label')[1].getElementsByTagName('input')[0].addEventListener('click', function () {
    invokeSwitch('closeToTray', closeToTrayLabel);
});
optimizeAppLabel.parentElement.getElementsByTagName('label')[1].getElementsByTagName('input')[0].addEventListener('click', function () {
    invokeSwitch('optimizeApp', optimizeAppLabel);
});
songNotificationsLabel.parentElement.getElementsByTagName('label')[1].getElementsByTagName('input')[0].addEventListener('click', function () {
    invokeSwitch('songNotifications', songNotificationsLabel);
});
deemixIntegrationLabel.parentElement.getElementsByTagName('label')[1].getElementsByTagName('input')[0].addEventListener('click', function() {
    invokeSwitch('deemixIntegration', deemixIntegrationLabel);
});
discordRPCLabel.parentElement.getElementsByTagName('label')[1].getElementsByTagName('input')[0].addEventListener('click', function() {
    invokeSwitch('discordRPC', discordRPCLabel);
});
inputVolumePower.addEventListener('blur', function () {
    invokeInput('volumePower', inputVolumePower);
});
inputDownloadSpeed.addEventListener('blur', function () {
    invokeInput('downloadLimit', inputDownloadSpeed);
});
inputWebPort.addEventListener('blur', function () {
    invokeInput('webPort', inputWebPort);
});

initializeSettingsStates();

// Reset settings

let resetSettingsButton = document.getElementById('resetSettings');

resetSettingsButton.addEventListener('click', function() {
    ipcRenderer.send('resetSettings');
    initializeSettingsStates();
});
