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
                if (this.window) {
                    if (this.window.isMinimized() || !this.window.isVisible()) {
                        this.window.restore();
                    }
                    this.window.focus();
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
        this.registerMediaKeys(this.window);
        initIPC(this.window);
    }
    
    // This is for mac/windows, linux uses mpris instead
    registerMediaKeys(window) {
        if (!globalShortcut.isRegistered('MediaNextTrack')) {
            globalShortcut.register('MediaNextTrack', () => {
                window.webContents.executeJavaScript('dzPlayer.control.nextSong()');
            });
        }
        if (!globalShortcut.isRegistered('MediaPlayPause')) {
            globalShortcut.register('MediaPlayPause', () => {
                window.webContents.executeJavaScript('dzPlayer.control.togglePause();');
            });
        }
        if (!globalShortcut.isRegistered('MediaPreviousTrack')) {
            globalShortcut.register('MediaPreviousTrack', () => {
                window.webContents.executeJavaScript('dzPlayer.control.prevSong()');
            });
        }
    }
}

new Deezer();
