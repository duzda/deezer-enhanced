/* global ipcRenderer, Bridge, path */

(function() {
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
        document.getElementById('download-icon').classList.remove('color-primary');
        document.getElementById('download-button-wrapper').hidden = !(url.includes('album') || url.includes('playlist') || url.includes('artist'));
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

    function injectDownload() {
        let topbar = document.getElementById('page_topbar');
        if (topbar != null) {
            let poppers = topbar.getElementsByClassName('popper-wrapper');
            if (topbar != null && poppers != null && poppers.length > 1 && poppers[1] != null) {
                Bridge.LazyReader.getOnce(path.join('injections', 'downloads', 'download-button.html'), (data) => {
                    let div = document.createElement('div');
                    div.className = 'popper-wrapper topbar-action';
                    div.id = 'download-button-wrapper';
                    div.hidden = true;
                    div.innerHTML = data;
                    topbar.insertBefore(div, poppers[1]);
                });
            } else {
                console.warn('There\'s nowhere to put downloads button');
            }
        } else {
            setTimeout(injectDownload, 100);
        }
    }

    getPageAlerts();
    injectDownload();
    Bridge.bindHistoryCallback(onUrlChange);
})();

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
    document.getElementById('download-icon').classList.add('color-primary');
}
