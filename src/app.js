const Window = require('./window/window');
const electron = require('electron');
const { app, globalShortcut, session, nativeTheme } = electron;
const { initIPC } = require('./ipc_handler');
let dbus = require('dbus-native');

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
        this.registerDBusTheme(this.window);
        this.registerMediaKeys(this.window);
        initIPC(this.window);
    }

    registerDBusTheme(window) {
        let sessionBus = dbus.sessionBus();
        // custom implementation of freedesktop darkmode switching
        // because electron does not fetch this yet
        sessionBus.getService('org.freedesktop.portal.Desktop').getInterface(
            '/org/freedesktop/portal/desktop',
            'org.freedesktop.portal.Settings', function(err, settings) {
        
                settings.Read('org.freedesktop.appearance', 'color-scheme', function(err, resp) {
                console.log('Initial color-scheme', resp[1][0][1][0]);
                window.initialTheme = nativeTheme.themeSource = resp[1][0][1][0] ? 'dark' : 'light';
            });
         
            // dbus signals are EventEmitter events
            settings.on('SettingChanged', function() {
                if (arguments['0'] == 'org.freedesktop.appearance' && arguments['1'] == 'color-scheme') {
                    nativeTheme.themeSource = arguments['2'][1][0] ? 'dark' : 'light';
                    console.log('Changed color-scheme', arguments['2'][1][0]);
                    // This is needed because deezer entirely ignores native theme @media queries
                    // despite there are mentions of it in JS source code.
                    // We are still setting the nativeTheme.themeSource for debugger and
                    // use in our own code
                    window.webContents.executeJavaScript('setTheme('+arguments['2'][1][0]+')');
                }
            });
        });
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
