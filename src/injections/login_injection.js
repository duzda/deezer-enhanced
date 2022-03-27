const { ipcRenderer } = require("electron");
const LazyReader = require("../utils/lazy_reader");

// Exposes the API
window.Bridge = {
    LazyReader: LazyReader
}

function pollDzUID() {
    if (typeof dataLayer !== 'undefined' && dataLayer[0].deezer_user_id != 0) {
        ipcRenderer.invoke("onLogin");
    } else {
        setTimeout(pollDzUID, 100);
    }
}

pollDzUID()