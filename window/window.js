const path = require('path');
const { BrowserWindow, dialog } = require('electron');
const WindowSettings = require('./window_settings');

class Window extends BrowserWindow {
    constructor(app, parent) {
        let params = {
            title: "Deezer Enhanced",
            icon: path.join(__dirname, '..', 'assets', 'icon.png'),
            webPreferences: {
                nodeIntegration: true,
                nativeWindowOpen: true,
                devTools: true,
                contextIsolation: false,
                preload: path.join(__dirname, '..', "settings", "injection.js")
            },
            backgroundColor: '#2e2c29',
            show: false
        };
        super(params);
        this.app = app;
        this.parent = parent;
        this.settings = this.parent.settings;
        this.windowSettings = new WindowSettings(this, this.settings, this.parent.tray, this.webContents);
        this.setMenuBarVisibility(false);

        this.loadURL("https://deezer.com", { userAgent: process.env.userAgent });
        this.createEvents();
    }

    // Gets called once the user logs in, if he's already logged in, gets called immediately
    onLogin() {
        // This variable is used to export values
        this.webContents.executeJavaScript(`let exportedValues = {}`)

        this.windowSettings.hookVolumeControls();
    }

    createEvents() {
        this.webContents.on('did-fail-load', (e, errCode, errorDescription) => {
            let message = errorDescription;
            switch (errCode) {
                case -2: message = "No internet connection"
            }
            dialog.showErrorBox("Error", message + ", Error ID: " + errCode);
            this.destroy()
            this.app.quit(errCode);
        })
        this.on('ready-to-show', () => {
            this.show();
        })
        this.on("close", event => {
            if (this.settings.getAttribute("closeToTray") == "true" &&
                this.settings.getAttribute("enableTray") == "true") {
                event.preventDefault();
                this.hide();
                return false;
            } else {
                this.destroy();
                this.app.quit();
            }
        })
    }
}

module.exports = Window;
