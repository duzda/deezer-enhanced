const path = require('path');
const express = require('express');

class WebServer {
    constructor(window) {
        this.window = window;
        
        this.expressapp = express();
        this.expressapp.use(express.static(path.join(__dirname, '..', 'web')));
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
                    if (data) {
                        res.send(data);
                    } else {
                        res.send('{"result":"error"}');
                    }
                });
        });
        this.expressapp.get('/api/playing', (req, res) => {
            this.window.webContents.executeJavaScript('dzPlayer.isPlaying()')
                .then((data) => {
                    res.send(data);
                });
        });
        this.expressapp.get('/api/gettime', (req, res) => {
            this.window.webContents.executeJavaScript('dzPlayer.getPosition()')
                .then((data) => {
                    res.send(Math.round(data).toString());
                });
        });
        this.expressapp.get('/api/settime', (req, res) => {
            this.window.webContents.executeJavaScript(`dzPlayer.control.seek(${req.query['time']} / dzPlayer.duration)`);
            res.send('{"result":"ok"}');
        });
        this.expressapp.get('/api/setfavorite', (req, res) => {
            this.window.webContents.executeJavaScript(' \
            actions = document.getElementsByClassName("track-actions"); \
            if (actions && actions.length > 0) { \
                actions = actions[0].querySelector("button[aria-label=\'Add to favourite tracks\']"); \
                if (!actions) { actions = track[0].querySelector("button[aria-label=\'Remove from Favourite tracks\']"); } \
                if (actions) { actions.click(); } \
            }');
            res.send('{"result":"ok"}');
        });
        this.expressapp.get('/api/getfavorite', (req, res) => {
            this.window.webContents.executeJavaScript(' \
            track = document.getElementsByClassName("track-actions"); \
            if (track && track.length > 0) { \
                let actions = track[0].querySelector("button[aria-label=\'Add to favourite tracks\']"); \
                if (!actions) { actions = track[0].querySelector("button[aria-label=\'Remove from Favourite tracks\']"); } \
                if (actions && actions.childElementCount > 0) { \
                    let heart = actions.children[0].getAttribute("data-testid"); \
                    heart == "HeartFillIcon"; \
                } else { false; } \
            } else { false; }')
                .then((favorite) => {
                    res.send(favorite);
                });
        });
        this.expressapp.get('/api/setshuffle', (req, res) => {
            this.window.webContents.executeJavaScript('dzPlayer.shuffle')
                .then((shuffle) => {
                    let shuffle_status = !shuffle;
                    this.window.webContents.executeJavaScript(`dzPlayer.control.setShuffle(${shuffle_status});`);
                    res.send('{"result":"ok"}');
                });
        });
        this.expressapp.get('/api/getshuffle', (req, res) => {
            this.window.webContents.executeJavaScript('dzPlayer.shuffle')
                .then((shuffle) => {
                    res.send(shuffle);
                });
        });
        this.expressapp.get('/api/setrepeat', (req, res) => {
            this.window.webContents.executeJavaScript('dzPlayer.getRepeat()')
                .then((repeat) => {
                    repeat = (repeat + 1) % 3;
                    this.window.webContents.executeJavaScript(`dzPlayer.control.setRepeat(${repeat})`);
                    res.send('{"result":"ok"}');
                });
        });
        this.expressapp.get('/api/getrepeat', (req, res) => {
            this.window.webContents.executeJavaScript('dzPlayer.getRepeat()')
                .then((repeat) => {
                    res.send(repeat.toString());
                });
        });
        this.expressapp.get('/api/setvolume', (req, res) => {
            this.window.webContents.executeJavaScript(`dzPlayer.control.setVolume(${req.query['volume']})`);
            res.send('{"result":"ok"}');
        });
        this.expressapp.get('/api/getvolume', (req, res) => {
            this.window.webContents.executeJavaScript('dzPlayer.getVolume()')
                .then((volume) => {
                    res.send(volume.toString());
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
