const path = require('path');
const { BrowserWindow, dialog } = require('electron');
const WindowSettings = require('./window_settings');
const WindowBounds = require('../controllers/window_bounds');

class Window extends BrowserWindow {
    constructor(app, parent) {
        let params = {
            title: 'Deezer Enhanced',
            icon: path.join(process.resourcesPath, 'assets', 'icon.png'),
            webPreferences: {
                nodeIntegration: true,
                nativeWindowOpen: true,
                devTools: true,
                contextIsolation: false,
                preload: path.join(__dirname, '..', 'injections', 'login_injection.js')
            },
            backgroundColor: '#2e2c29',
            show: true
        };
        super(params);
        this.windowBounds = new WindowBounds(this);
        this.app = app;
        this.parent = parent;
        this.settings = this.parent.settings;
        this.windowSettings = new WindowSettings(this, this.settings, this.parent.tray, this.webContents);
        this.setMenuBarVisibility(false);
        this.loadFile(path.join(__dirname, '..', 'utils', 'loadscreen.html'));

        this.createEvents();
    }

    createEvents() {
        this.freshWindow = true;
        this.webContents.on('did-fail-load', (e, errCode, errorDescription) => {
            let message = errorDescription;
            switch (errCode) {
            case -2: message = 'No internet connection';
            }
            dialog.showErrorBox('Error', message + ', Error ID: ' + errCode);
            this.destroy();
            this.app.quit(errCode);
        });
        this.on('ready-to-show', () => {
            // Change to deezer because right now, we're at "loading screen"
            if (this.freshWindow) {
                this.loadURL('https://deezer.com', { userAgent: process.env.userAgent });
                this.freshWindow = false;
            }
        });
        this.on('close', event => {
            this.windowBounds.preferences = { 
                bounds: this.getBounds(),
                maximized: this.isMaximized()
            };
            this.windowBounds.save(false);
            if (this.settings.getAttribute('closeToTray') == 'true' &&
                this.settings.getAttribute('enableTray') == 'true' &&
                this.parent.loginHooked) {
                event.preventDefault();
                this.hide();
                return false;
            } else {
                this.destroy();
                this.app.quit();
            }
        });
    }
}

module.exports = Window;
