const Window = require('./window/window');
const electron = require('electron');
const { app, globalShortcut, session } = electron;
const { initIPC } = require('./ipc_handler');

// To hide unsupported browser error
process.env.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36';

// Disable chromium's poor MPRIS
app.commandLine.appendSwitch('disable-features', 'MediaSessionService');

const gotTheLock = app.requestSingleInstanceLock();

class Deezer {
    constructor() {
        // Single instance lock
        if (!gotTheLock) {
            app.quit();
        } else {
            app.on('second-instance', () => {
                // Someone tried to run a second instance, we should focus our window.
                if (this.win) {
                    if (this.win.isMinimized() || !this.win.isVisible()) {
                        this.win.restore();
                    }
                    this.win.focus();
                }
            });
            
            app.on('ready', () => {
                this.createWin();
            });
        }
        
        app.on('browser-window-created', (e, window) => {
            window.setMenuBarVisibility(false);
        });
    }
    
    async createWin() {
        session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
            details.requestHeaders['User-Agent'] = process.env.userAgent;
            callback({ cancel: false, requestHeaders: details.requestHeaders });
        });
        
        this.window = new Window(this);
        this.registerMediaKeys();
        initIPC(this.window);
    }
    
    // This is for mac/windows, linux uses mpris instead
    registerMediaKeys() {
        if (!globalShortcut.isRegistered('MediaNextTrack')) {
            globalShortcut.register('MediaNextTrack', () => {
                this.win.webContents.executeJavaScript('dzPlayer.control.nextSong()');
            });
        }
        if (!globalShortcut.isRegistered('MediaPlayPause')) {
            globalShortcut.register('MediaPlayPause', () => {
                this.win.webContents.executeJavaScript('dzPlayer.control.togglePause();');
            });
        }
        if (!globalShortcut.isRegistered('MediaPreviousTrack')) {
            globalShortcut.register('MediaPreviousTrack', () => {
                this.win.webContents.executeJavaScript('dzPlayer.control.prevSong()');
            });
        }
    }
}

new Deezer();
