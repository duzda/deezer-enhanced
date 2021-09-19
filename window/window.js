const path = require('path');
const { BrowserWindow, dialog } = require('electron');
const WindowSettings = require('./window_settings');

class Window extends BrowserWindow {
    constructor(app, parent, { width, height }) {
        let params = {
            width,
            height,
            title: "Deezer Player",
            icon: path.join(__dirname, '..', 'assets', 'dist_icon.png'),
            webPreferences: {
                nodeIntegration: true,
                nativeWindowOpen: true,
                devTools: true,
                contextIsolation: false,
                preload: path.join(app.getAppPath(), "settings", "injection.js")
            },
            backgroundColor: '#2e2c29',
            show: false
        };
        super(params);
        this.app = app;
        this.parent = parent;
        this.settings = this.parent.settings;
        new WindowSettings(this, this.settings, this.webContents);
        this.setMenuBarVisibility(false);

        this.loadURL("https://deezer.com", { userAgent: process.env.userAgent });
        this.createEvents();
    }

    createEvents() {
        this.webContents.on('did-fail-load', (e, errCode, errMessage) => {
            //On some systems, this error occurs without explanation
            if (errCode == -3)
                return false;
            console.error(errCode, errMessage);
            dialog.showErrorBox("Load failed", `Please check your connection`);
            this.destroy()
            this.app.quit(-1);
        })
        this.on('ready-to-show', () => {
            this.show();
        })
        this.on("close", event => {
            if (this.settings.getAttribute("closeToTray") == "true") {
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
