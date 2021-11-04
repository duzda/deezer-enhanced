const { app, Menu, Tray } = require('electron');
const path = require('path');

const volumeStep = 0.05;

const trayIcon = path.join(process.resourcesPath, 'assets', 'icon.png')

class AppTray {
    constructor(window, mpris) {
        this.tray = Tray(trayIcon);
        this.window = window;
        this.mpris = mpris;

        this.initTray();
    }

    initTray() {
        let template = [{
            label: "Show/Hide",
            enabled: true,
            click: () => {
                if (!this.window.isVisible())
                    this.window.restore();
                else
                    this.window.hide();
            }
        }, {
            type: 'separator'
        }, {
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
            type: 'separator'
        }, {
            label: "Favorite/Unfavorite",
            enabled: true,
            click: () => {
                this.window.webContents.executeJavaScript(" \
                actions = document.getElementsByClassName('track-actions')[0].getElementsByTagName('button'); \
                actions[actions.length - 1].click();");
            }
        }, {
            type: 'separator'
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
            label: "Mute",
            enabled: true,
            click: () => {
                this.window.webContents.executeJavaScript("dzPlayer.control.mute(!dzPlayer.muted)")
            }
        }, {
            type: 'separator'
        }, {
            label: "Quit",
            enabled: true,
            click: () => {
                this.window.destroy()
                app.quit()
            }
        }]

        this.tray.setContextMenu(new Menu.buildFromTemplate(template))

        this.tray.on("click", () => {
            if (!this.window.isVisible())
                this.window.restore();
            else
                this.window.hide();
        })
    }
}

module.exports = AppTray;
