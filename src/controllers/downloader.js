const LazyReader = require('../utils/lazy_reader');
const path = require('path');
const fs = require('fs');
const { app, dialog } = require('electron');
const exec = require('child_process').exec;

const deemixARL = path.join(app.getPath('appData'), 'deemix', '.arl');
const deemixConfig = path.join(app.getPath('appData'), 'deemix', 'config.json');

class Downloader {
    constructor(window, arl) {
        this.window = window;
        this.idMap = new Map();
        this.warningsSet = new Set();
        this.bitrate = 3;

        fs.writeFile(deemixARL, arl, (err) => {
            if (err) {
                console.error(err);
                dialog.showErrorBox('Deemix error', 'deemix has not been found! Make sure to use the correct version: https://gitlab.com/RemixDev/deemix-py\nerror: ' + err);
            }
        });

        fs.readFile(deemixConfig, (err, data) => {
            const settings = JSON.parse(data);
            this.bitrate = settings['maxBitrate'];
        });

        LazyReader.getOnce(path.join('injections', 'downloads', 'add_download_injection.js'), (data) => {
            this.window.webContents.executeJavaScript(data);
        });
    }

    // I believe there are some instances where we know the album name, yet some error happends, such as loosing connection etc, 
    // this however hasn't been tested, but the code should allow easy implementation
    log(data, url) {
        let lines = data.split('\n');

        // We get mess of stdout, so we need to check line by line
        lines.forEach(line => {
            if (line.length == 0) {
                return;
            }

            let split = line.split(' ', 1);
            let id = split[0];
            id = id.substring(1, id.length - 1);

            if (line.includes('deezer.errors.GWAPIError')) {
                // Url because we are not sure with the name
                this.window.webContents.send('downloadFinished', 'ERROR', url);
                this.window.webContents.send('err', 'deemix: ' + line);
            } else if (line.includes('Traceback (most recent call last):')) {
                this.warningsSet.add(this.idMap.delete(id));
                this.window.webContents.send('err', 'deemix ' + line);
            } else if (line.includes('Finished downloading')) {
                let name = this.idMap.get(id);

                if (this.idMap.delete(id)) {
                    this.window.webContents.send('downloadFinished', this.warningsSet.has(id) ? 'WARNING' : 'SUCCESS', name);
                    this.warningsSet.delete(id);
                }

                this.window.webContents.send('log', 'deemix: ' + line);
            } else {
                this.window.webContents.send('log', 'deemix: ' + line);
            }
        });
    }

    async downloadURL(url, name, type) {
        const downloadScript = exec(`deemix ${url}`);

        let splittedUrl = url.split('/');
        splittedUrl[splittedUrl.length - 1] = splittedUrl[splittedUrl.length - 1].split('?', 1)[0];

        let convertedUrl;
        // No notification for tracks :(
        if (type != 'track') {
            convertedUrl = type + '_' + splittedUrl[splittedUrl.length - 1] + '_' + this.bitrate;
        }

        this.idMap.set(convertedUrl, name);

        downloadScript.stdout.on('data', (data) => {
            this.log(data, url);
        });

        downloadScript.stderr.on('data', (data) => {
            this.log(data, url);
        });
    }
}

module.exports = Downloader;
