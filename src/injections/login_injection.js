/* global dataLayer */

const path = require('path');
const { ipcRenderer } = require('electron');
const LazyReader = require('../utils/lazy_reader');
const { bindHistory, bindHistoryCallback } = require('./history');

ipcRenderer.on('log', (event, data) => {
    console.log(data);
});

ipcRenderer.on('err', (event, data) => {
    console.error(data);
});

bindHistory();

// Exposes the API
window.Bridge = {
    LazyReader: LazyReader,
    bindHistoryCallback: bindHistoryCallback,
    volumePower: 0
};

window.path = path;
window.ipcRenderer = ipcRenderer;

function pollDzUID() {
    if (typeof dataLayer !== 'undefined' && dataLayer[0].deezer_user_id != 0) {
        ipcRenderer.invoke('onLogin');
    } else {
        setTimeout(pollDzUID, 100);
    }
}

pollDzUID();
