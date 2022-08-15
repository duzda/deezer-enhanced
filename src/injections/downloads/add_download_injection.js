/* global ipcRenderer, Bridge, path */

// Lock to prevent spawning multiple polling threads
let polling = false;
// To prevent adding the button to the old page that is just getting removed
let oldWrapper = null;

let pageAlerts;

// error is type of string with values SUCCESS, WARNING, ERROR
ipcRenderer.on('downloadFinished', (event, error, name) => {
    console.log(error, name);

    let wrapper = document.createElement('div');
    wrapper.classList.add('alert-wrapper');

    let div = document.createElement('div');
    div.classList.add('alert');

    let alertType;

    switch (error) {
    case 'SUCCESS':
        alertType = 'alert-success';
        div.innerHTML = name + ' has been downloaded!';
        break;
    case 'WARNING':
        alertType = 'alert-warning';
        div.innerHTML = name + ' something went wrong, see console (CTRL+SHIFT+I)';
        break;
    case 'ERROR':
        alertType = 'alert-danger';
        div.innerHTML = name + ' an error occurred, see console (CTRL+SHIFT+I)';
        break;
    }

    div.classList.add(alertType);
    div.style.marginBottom = 0;

    wrapper.appendChild(div);
    wrapper.onclick = () => {
        pageAlerts.removeChild(wrapper);
    };

    pageAlerts.appendChild(wrapper);
}); 

function onUrlChange(url) {
    if (url.includes('profile') || polling) {
        return;
    }
    if (url.includes('album') || 
            url.includes('playlist')) {
        pollButtonWrapper();
    } else if (url.includes('artist')) {
        pollUnorderedList();
    }
}

function pollButtonWrapper() {
    poll('_2tIG4', addDownloadCommon);
}

function pollUnorderedList() {
    poll('_1k3N9', addDownloadArtist);
}

function poll(className, executeFunction) {
    polling = true;
    let buttonwrapper = document.getElementsByClassName(className);
    if (buttonwrapper.length == 0 || buttonwrapper[0] == oldWrapper) {
        setTimeout(poll, 100, className, executeFunction);
        return;
    }

    buttonwrapper = buttonwrapper[0];
    oldWrapper = buttonwrapper;

    executeFunction(buttonwrapper);

    polling = false;
}

function addDownloadCommon(wrapper) {
    addDownloadButton(wrapper, 'div', ['aLCv2']);
}

function addDownloadArtist(wrapper) {
    addDownloadButton(wrapper.children[0], 'li', ['list-actions-item']);
}

function addDownloadButton(wrapper, element, ...classes) {
    Bridge.LazyReader.get(path.join('injections', 'downloads', 'download_button.html'), (data) => {
        let buttonListItem = document.createElement(element);
        classes.forEach(c => {
            buttonListItem.classList.add(c);
        });
        buttonListItem.innerHTML = data;
        // Append download button right after play button
        wrapper.insertBefore(buttonListItem, wrapper.children[1]);
    });
}

// This is called via html
// eslint-disable-next-line no-unused-vars
function download() {
    let name = 'unknown';
    let type = 'unknown';

    // album is used for both, track and album
    if (location.href.includes('album')) {
        name = document.querySelector('[data-testid="masthead-title"]').innerHTML + ' - ' + document.querySelector('[data-testid="creator-name"]').innerHTML;
        let count = document.querySelector('[data-testid="is-fully-fetched"]').getAttribute('aria-rowcount');
        type = count == 1 ? 'track' : 'album';
    } else {
        // Both playlist and artist have set the same atribute
        let splittedUrl = location.href.split('/');
        type = splittedUrl[splittedUrl.length - 2];
        name = document.querySelector('[data-testid="masthead-title"]').innerHTML;
    }

    if (location.href.includes('artist')) {
        ipcRenderer.send('download', location.href + '/discography', name, type);
    } else {
        ipcRenderer.send('download', location.href, name, type);
    }
    toggleButton();
}

function toggleButton() {
    document.getElementById('download-icon').classList.add('color-primary');
}

function getPageAlerts() {
    let alerts = document.getElementsByClassName('page-alerts');
    if (alerts.length > 0 && alerts[0] != null) {
        pageAlerts = alerts[0];
    } else {
        setTimeout(() => {
            getPageAlerts();
        }, 100);
    }
}

getPageAlerts();
Bridge.bindHistoryCallback(onUrlChange);
