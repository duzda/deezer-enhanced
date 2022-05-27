const path = require('path');
const express = require('express');

class WebServer {
    constructor(window, port) {
        this.window = window;
        this.port = port;
        
        const expressapp = express();
        expressapp.use(express.static(path.join(__dirname, '/../web')));
        expressapp.get('/api/prev', (req, res) => {
            this.window.webContents.executeJavaScript('dzPlayer.control.prevSong()');
            res.send('{"result":"ok"}');
        });
        expressapp.get('/api/playpause', (req, res) => {
            this.window.webContents.executeJavaScript('dzPlayer.control.togglePause();');
            res.send('{"result":"ok"}');
        });
        expressapp.get('/api/next', (req, res) => {
            this.window.webContents.executeJavaScript('dzPlayer.control.nextSong()');
            res.send('{"result":"ok"}');
        });
        expressapp.get('/api/cursong', (req, res) => {
            this.window.webContents.executeJavaScript('dzPlayer.getCurrentSong()')
                .then((data) => {
                    res.send(data);
                });
        });
        expressapp.get('/api/playing', (req, res) => {
            this.window.webContents.executeJavaScript('dzPlayer.isPlaying()')
                .then((data) => {
                    res.send(data);
                });
        });
        expressapp.listen(this.port);
    }
}

module.exports = WebServer;
