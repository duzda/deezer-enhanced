const { app, Menu, Tray } = require('electron');
const fs = require('fs');
const path = require('path');

const volumeStep = 0.05;

class AppTray {
    constructor(window, mpris) {
        fs.access(path.join(app.getPath('userData'), 'assets', 'icon.png'), (err) => {
            let trayIcon;
            if (err) {
                trayIcon = path.join(process.resourcesPath, 'assets', 'icon.png');
            } else {
                trayIcon = path.join(app.getPath('userData'), 'assets', 'icon.png');
            }
            this.tray = Tray(trayIcon);
            this.initTray();
        });
        this.window = window;
        this.mpris = mpris;
    }
    
    initTray() {
        let template = [{
            label: 'Show/Hide',
            enabled: true,
            click: () => {
                if (!this.window.isVisible()) {
                    this.window.restore();
                } else {
                    this.window.hide();
                }
            }
        }, {
            type: 'separator'
        }, {
            label: 'Play/Pause',
            enabled: true,
            click: () => {
                this.window.webContents.executeJavaScript('dzPlayer.control.togglePause();');
            }
        }, {
            label: 'Next',
            enabled: true,
            click: () => {
                this.window.webContents.executeJavaScript('dzPlayer.control.nextSong()');
            }
        }, {
            label: 'Previous',
            enabled: true,
            click: () => {
                this.window.webContents.executeJavaScript('dzPlayer.control.prevSong()');
            }
        }, {
            type: 'separator'
        }, {
            label: 'Favorite/Unfavorite',
            enabled: true,
            click: () => {
                this.window.webContents.executeJavaScript(' \
                actions = document.getElementsByClassName("track-actions")[0].getElementsByTagName("button"); \
                actions[actions.length - 1].click();');
            }
        }, {
            type: 'separator'
        }, {
            label: 'Volume Up',
            enabled: true,
            click: () => {
                this.window.webContents.executeJavaScript(`vol = dzPlayer.volume; vol += ${volumeStep}; vol > 1 && (vol = 1); dzPlayer.control.setVolume(vol);`);
            }
        }, {
            label: 'Volume Down',
            enabled: true,
            click: () => {
                this.window.webContents.executeJavaScript(`vol = dzPlayer.volume; vol -= ${volumeStep}; vol < 0 && (vol = 0); dzPlayer.control.setVolume(vol);`);
            }
        }, {
            label: 'Mute',
            enabled: true,
            click: () => {
                this.window.webContents.executeJavaScript('dzPlayer.control.mute(!dzPlayer.muted)');
            }
        }, {
            type: 'separator'
        }, {
            label: 'Quit',
            enabled: true,
            click: () => {
                this.window.exit();
            }
        }];
        
        this.tray.setContextMenu(new Menu.buildFromTemplate(template));
        
        this.tray.on('click', () => {
            if (!this.window.isVisible()) {
                this.window.restore();
            } else {
                this.window.hide();
            }
        });
    }
}

module.exports = AppTray;
