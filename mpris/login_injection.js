var electron = require('electron')

function pollDzUID() {
    if (dataLayer[0].deezer_user_id != 0) {
        electron.ipcRenderer.invoke("onLogin");
    } else {
        setTimeout(pollDzUID, 5000);
    }
}

pollDzUID()