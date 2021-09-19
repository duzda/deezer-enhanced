const { app, Menu, Tray } = require('electron');
const path = require('path');

const trayIcon = path.join(__dirname, '..', 'assets', 'icon.png');

const volumeStep = 0.10;

class AppTray {
    constructor(window) {
        this.tray = Tray(trayIcon);
        this.window = window;

        this.updateTray();
    }

    updateTray() {
        let model = [{
            label: "Play/Pause",
            enabled: true,
            click: () => {
                this.window.webContents.executeJavaScript("dzPlayer.control.togglePause();");
            }
        }, {
            label: "Next",
            enabled: true,
            click: () => {
                this.window.webContents.executeJavaScript("dzPlayer.control.nextSong()");
            }
        }, {
            label: "Previous",
            enabled: true,
            click: () => {
                this.window.webContents.executeJavaScript("dzPlayer.control.prevSong()");
            }
        }, {
            label: "Unfavourite/Favourite",
            enabled: true,
            click: () => {
                this.window.webContents.executeJavaScript(" \
                actions = document.getElementsByClassName('track-actions')[0].getElementsByTagName('button'); \
                actions[actions.length - 1].click();");
            }
        }, {
            label: "Volume UP",
            enabled: true,
            click: () => {
                this.window.webContents.executeJavaScript(`vol = dzPlayer.volume; vol += ${volumeStep}; vol > 1 && (vol = 1); dzPlayer.control.setVolume(vol);`)
            }
        }, {
            label: "Volume Down",
            enabled: true,
            click: () => {
                this.window.webContents.executeJavaScript(`vol = dzPlayer.volume; vol -= ${volumeStep}; vol < 0 && (vol = 0); dzPlayer.control.setVolume(vol);`)
            }
        }, {
            label: "Volume Mute",
            enabled: true,
            click: () => {
                this.window.webContents.executeJavaScript("dzPlayer.control.mute(!dzPlayer.muted)")
            }
        }, {
            label: "Quit",
            enabled: true,
            click: () => {
                this.window.destroy()
                app.quit()
            }
        }];
        this.tray.on("click", () => {
            if (!this.window.isVisible())
                this.window.restore();
            else
                this.window.hide();
        })
        this.tray.setContextMenu(new Menu.buildFromTemplate(model))
    }
}

module.exports = AppTray;
