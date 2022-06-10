const path = require('path');
const { app, BrowserWindow, dialog } = require('electron');
const WindowBounds = require('../controllers/window_bounds');
const Settings = require('../controllers/settings');
const { initializeHooks } = require('./hooker.js');
const { isLoggedIn } = require('../ipc_handler');

class Window extends BrowserWindow {
    // this.tray
    // this.settings
    // this.webserver
    // this.downloader
    // this.mpris

    constructor(parent) {
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
        this.parent = parent;
        this.settings = new Settings();
        this.setMenuBarVisibility(false);
        this.loadFile(path.join(__dirname, '..', 'utils', 'loadscreen.html'));

        this.createEvents();
    }

    createEvents() {
        this.webContents.on('did-fail-load', (e, errCode, errorDescription) => {
            let message = errorDescription;
            switch (errCode) {
            case -2: message = 'No internet connection';
            }
            dialog.showErrorBox('Error', message + ', Error ID: ' + errCode);
            this.destroy();
            app.quit(errCode);
        });
        this.once('ready-to-show', () => {
            // Change to deezer because right now, we're at "loading screen"
            this.loadURL('https://deezer.com', { userAgent: process.env.userAgent });
        });
        this.on('close', (event) => {
            this.windowBounds.preferences = { 
                bounds: this.getBounds(),
                maximized: this.isMaximized()
            };
            this.windowBounds.save(false);
            if (this.settings.getAttribute('closeToTray') == 'true' &&
                this.settings.getAttribute('enableTray') == 'true' &&
                isLoggedIn()) {
                event.preventDefault();
                this.hide();
                return false;
            } else {
                this.destroy();
                app.quit();
            }
        });
    }

    // Called from ipc_handler.js when user logs in
    initializeSettings() {
        if (this.settings.finishedLoading) {
            initializeHooks(this, this.settings);
        } else {
            this.settings.onload = () => {
                this.initializeSettings();
            };
        }
    }
}

module.exports = Window;
