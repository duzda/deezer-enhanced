const path = require('path');
const express = require('express');

class WebServer {
    constructor(window) {
        this.window = window;
        
        this.expressapp = express();
        this.expressapp.use(express.static(path.join(__dirname, '/../web')));
        this.expressapp.get('/api/prev', (req, res) => {
            this.window.webContents.executeJavaScript('dzPlayer.control.prevSong()');
            res.send('{"result":"ok"}');
        });
        this.expressapp.get('/api/playpause', (req, res) => {
            this.window.webContents.executeJavaScript('dzPlayer.control.togglePause();');
            res.send('{"result":"ok"}');
        });
        this.expressapp.get('/api/next', (req, res) => {
            this.window.webContents.executeJavaScript('dzPlayer.control.nextSong()');
            res.send('{"result":"ok"}');
        });
        this.expressapp.get('/api/cursong', (req, res) => {
            this.window.webContents.executeJavaScript('dzPlayer.getCurrentSong()')
                .then((data) => {
                    res.send(data);
                });
        });
        this.expressapp.get('/api/playing', (req, res) => {
            this.window.webContents.executeJavaScript('dzPlayer.isPlaying()')
                .then((data) => {
                    res.send(data);
                });
        });
    }

    start(port) {
        if (port == 0) {
            return;
        }

        this.server = this.expressapp.listen(port);
    }

    stop() {
        if (!this.server) {
            return;
        }

        this.server.close();
    }
}

module.exports = WebServer;
