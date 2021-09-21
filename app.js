const Window = require('./window/window');
const Player = require('mpris-service');
const electron = require('electron');
const { app, globalShortcut, session, ipcMain, Notification } = electron;
const Settings = require('./controllers/settings');
const AppTray = require('./controllers/app_tray');
const Mpris = require('./controllers/mpris');

// To hide unsupported browser error
process.env.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36';

const gotTheLock = app.requestSingleInstanceLock();

class Deezer {
    constructor() {
        // Single instance lock
        if (!gotTheLock) {
            app.quit()
        } else {
            app.on('second-instance', (event, commandLine, workingDirectory) => {
                // Someone tried to run a second instance, we should focus our window.
                if (this.win) {
                    if (this.win.isMinimized() || !this.win.isVisible()) this.win.restore();
                    this.win.focus();
                }
            })

            this.init();
            app.on('ready', () => {
                this.createWin();
            });
        }

        app.on('browser-window-created', (e, window) => {
            window.setMenuBarVisibility(false);
        })
    }

    init() {
        this.settings = new Settings();
        this.tray = null;
        this.win = null;
        this.mpris = null;
    }

    async createWin() {
        session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
            details.requestHeaders['User-Agent'] = process.env.userAgent;
            callback({ cancel: false, requestHeaders: details.requestHeaders })
        });

        this.win = new Window(app, this);
        this.registerMediaKeys();
        this.tray = new AppTray(this.win);
        this.mpris = new Mpris(this.win);
        this.initIPC();
    }

    // This is for mac/windows, linux uses mpris instead
    registerMediaKeys() {
        if (!globalShortcut.isRegistered("MediaNextTrack"))
            globalShortcut.register('MediaNextTrack', () => {
                this.win.webContents.executeJavaScript("dzPlayer.control.nextSong()");
            });
        if (!globalShortcut.isRegistered("MediaPlayPause"))
            globalShortcut.register('MediaPlayPause', () => {
                this.win.webContents.executeJavaScript("dzPlayer.control.togglePause();");
            });
        if (!globalShortcut.isRegistered("MediaPreviousTrack"))
            globalShortcut.register('MediaPreviousTrack', () => {
                this.win.webContents.executeJavaScript("dzPlayer.control.prevSong()");
            });
    }

    initIPC() {
        ipcMain.on('readDZCurSong', (event, data) => {
            if (this.settings.getAttribute('songNotifications') == 'true') {
                if (data['SNG_ID'] != this.mpris.id)
                    new Notification({ title: data['SNG_TITLE'], body: data['ART_NAME'], image: 'https://e-cdns-images.dzcdn.net/images/cover/' + data['ALB_PICTURE'] + '/380x380-000000-80-0-0.jpg' }).show()
            }

            this.updateMetadata(data)
        });
        ipcMain.on('readDZCurPosition', (event, data) => {
            this.mpris.songStart = new Date();
            this.mpris.songOffset = data * 1000 * 1000;
        });
        ipcMain.on('readDZPlaying', (event, data) => {
            if (data)
                this.mpris.player.playbackStatus = Player.PLAYBACK_STATUS_PLAYING;
            else
                this.mpris.player.playbackStatus = Player.PLAYBACK_STATUS_PAUSED;
        });
        ipcMain.on('readDZVolume', (event, data) => {
            this.mpris.player.volume = data;
        });
        ipcMain.on('readDZShuffle', (event, data) => {
            this.mpris.player.shuffle = data;
        });
        ipcMain.on('readDZRepeat', (event, data) => {
            switch (data) {
                case 0:
                    this.mpris.player.loopStatus = "None";
                    break;
                case 1:
                    this.mpris.player.loopStatus = "Playlist";
                    break;
                case 2:
                    this.mpris.player.loopStatus = "Track";
                    break;
            };
        });
        // To initialize settings graphically
        ipcMain.handle("requestSettings", async (event, arg) => {
            return this.settings.preferences;
        });
        // To set setting whenever there is a change
        ipcMain.on("setSetting", (event, key, value) => {
            this.settings.setAttribute(key, value)
        });
    }

    updateMetadata(data) {
        var song = data;
        this.mpris.id = song['SNG_ID'];
        var artists = [];
        if ('ARTISTS' in song) {
            song['ARTISTS'].forEach(function (artist) {
                artists.push(artist['ART_NAME']);
            });
        } else {
            artists = [song['ART_NAME']];
        }
        this.mpris.player.metadata = {
            'mpris:trackid': this.mpris.player.objectPath('track/0'), // Setting SNG_ID causes problems, might wanna fix later though
            'mpris:length': song['DURATION'] * 1000 * 1000, // In microseconds
            'mpris:artUrl': 'https://e-cdns-images.dzcdn.net/images/cover/' + song['ALB_PICTURE'] + '/380x380-000000-80-0-0.jpg',
            'xesam:title': song['SNG_TITLE'],
            'xesam:album': song['ALB_TITLE'],
            'xesam:artist': artists
        };
    }
}

new Deezer();
