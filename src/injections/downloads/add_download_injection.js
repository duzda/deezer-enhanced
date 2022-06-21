/* global ipcRenderer, Bridge, path */

// Lock to prevent spawning multiple polling threads
let polling = false;
// To prevent adding the button to the old page that is just getting removed
let oldWrapper = null;

function onUrlChange(url) {
    console.log(url);
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
        var buttonListItem = document.createElement(element);
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
    if (location.href.includes('artist')) {
        console.log('discography');
        ipcRenderer.send('download', location.href + '/discography');
    } else {
        ipcRenderer.send('download', location.href);
    }
    toggleButton();
}

function toggleButton() {
    document.getElementById('download-icon').classList.add('color-primary');
}

Bridge.bindHistoryCallback(onUrlChange);
