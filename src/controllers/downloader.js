const deemix = require('deemix');
const deezer = require('deezer-js');
const LazyReader = require('../utils/lazy_reader');
const path = require('path');
const { app } = require('electron');

class Downloader {
    constructor(window, arl) {
        this.window = window;
        this.arl = arl;
        this.resetDeemixSettings();

        this.deezerInstance = new deezer.Deezer();
        this.deezerInstance.login_via_arl(arl).then(v => {
            if (v) {
                console.log('Logged in!');
            } else {
                console.log('Can not log in');
            }
        });

        LazyReader.get(path.join('injections', 'downloads', 'add_download_injection.js'), (data) => {
            this.window.webContents.executeJavaScript(data);
        });
    }

    setDeemixSettings(newSettings) {
        this.deemixSettings = newSettings;
    }

    resetDeemixSettings() {
        let deemixSettings = deemix.settings.DEFAULTS;
        deemixSettings.downloadLocation = path.join(app.getPath('music') + '/deezer-enhanced');
        deemixSettings.maxBitrate = String(deezer.TrackFormats.FLAC);
        deemixSettings.overwriteFile = deemix.settings.OverwriteOption.DONT_OVERWRITE;
        this.setDeemixSettings(deemixSettings);
    }

    async downloadURL(url) {
        const listener = {
            send(key, data) {
                if (key == 'xx') {
                    console.log(key, data);
                }
                //console.log(key, data);
            }
        };

        deemix.generateDownloadObject(this.deezerInstance, url, this.deemixSettings.maxBitrate, {}, listener).then((object) => {
            if (Array.isArray(object)) {
                object.forEach(o => {
                    this.downloadObject(o);
                });
            } else {
                this.downloadObject(object);
            }
        }, (error) => {
            console.error(error);
        });
    }

    async downloadObject(object) {
        const listener = {
            send(key, data) {
                if (key == 'finishDownload') {
                    console.log(key, data);
                }
                //console.log(key, data);
            }
        };

        let deemixDownloader = new deemix.downloader.Downloader(this.deezerInstance, object, this.deemixSettings, listener);

        console.log(await deemixDownloader.start());
    }
}

module.exports = Downloader;
