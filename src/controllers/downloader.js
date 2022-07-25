const LazyReader = require('../utils/lazy_reader');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');
const exec = require('child_process').exec;

const deemixARL = path.join(app.getPath('appData'), 'deemix', '.arl');

class Downloader {
    constructor(window, arl) {
        this.window = window;

        fs.writeFile(deemixARL, arl, (err) => {
            if (err) {
                console.error(err);
            }
        });

        LazyReader.get(path.join('injections', 'downloads', 'add_download_injection.js'), (data) => {
            this.window.webContents.executeJavaScript(data);
        });
    }

    async downloadURL(url) {
        const downloadScript = exec(`deemix ${url}`);

        downloadScript.stdout.on('data', (data) => {
            console.log(data);
        });

        downloadScript.stderr.on('data', (data) => {
            console.log(data);
        });

        downloadScript.on('close', (code) => {
            console.log(code);
        });
    }
}

module.exports = Downloader;
