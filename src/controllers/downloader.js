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
                switch(key) {
                case 'startAddingArtist':
                    break;
                case 'finishAddingArtist':
                    break;
                case 'updateQueue':
                    break;
                case 'restoringQueue':
                    break;
                case 'cancellingCurrentItem':
                    break;
                case 'currentItemCancelled':
                    break;
                case 'startConversion':
                    break;
                case 'finishConversion':
                    break;
                case 'startConvertingSpotifyPlaylist':
                    break;
                case 'finishConvertingSpotifyPlaylist':
                    break;
                case 'errorMessage':
                    break;
                case 'queueError':
                    break;
                case 'alreadyInQueue':
                    break;
                case 'loginNeededToDownload':
                    break;
                case 'startGeneratingItems':
                    break;
                case 'finishGeneratingItems':
                    break;
                case 'removedAllDownloads':
                    break;
                case 'removedFinishedDownloads':
                    break;
                //console.log(key, data);
                }
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
                switch(key) {
                case 'removedFromQueue':
                    break;
                case 'currentItemCancelled':
                    break;
                case 'finishDownload':
                    break;
                }
            }
        };

        let deemixDownloader = new deemix.downloader.Downloader(this.deezerInstance, object, this.deemixSettings.preferences, listener);

        console.log(await deemixDownloader.start());
    }
}

module.exports = Downloader;
