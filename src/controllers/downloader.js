const deemix = require('deemix');
const deezer = require('deezer-js');
const LazyReader = require('../utils/lazy_reader');
const path = require('path');
const FileManager = require('../utils/file_manager');
const { app } = require('electron');

// See node_modules/deemix/deemix/settings.js for various settings
const filename = 'deemix-settings.json';

const defaults = deemix.settings.DEFAULTS;
defaults.downloadLocation = path.join(app.getPath('music') + '/deezer-enhanced');
defaults.maxBitrate = deezer.TrackFormats.FLAC;

class Downloader {
    constructor(window, arl) {
        this.window = window;
        this.arl = arl;
        this.createDefaultSettings();

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

    // If settings do not exist, creates a new file
    createDefaultSettings() {
        this.deemixSettings = new FileManager(filename, defaults);
        this.deemixSettings.onload = () => {
            this.deemixSettings.save();
        };
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

        deemix.generateDownloadObject(this.deezerInstance, url, this.deemixSettings.preferences.maxBitrate, {}, listener).then((object) => {
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

        let deemixDownloader = new deemix.downloader.Downloader(this.deezerInstance, object, this.deemixSettings.preferences, listener);

        console.log(await deemixDownloader.start());
    }
}

module.exports = Downloader;
