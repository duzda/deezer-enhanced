const { ipcMain, Notification } = require('electron');
const Player = require('mpris-service');

let loginHooked = false;

function initIPC(window) {
    ipcMain.on('readDZCurSong', (event, data) => {
        if (window.settings.getAttribute('songNotifications') == 'true') {
            if (data['SNG_ID'] != window.mpris.id) {
                new Notification({ title: data['SNG_TITLE'], body: data['ART_NAME'], image: 'https://e-cdns-images.dzcdn.net/images/cover/' + data['ALB_PICTURE'] + '/380x380-000000-80-0-0.jpg' }).show();
            }
        }
        
        if (data['SNG_ID']) {
            window.mpris.updateMetadataSong(data);
        } else if (data['EPISODE_ID']) {
            window.mpris.updateMetadataPodcast(data);
        }
    });
    ipcMain.on('readDZCurPosition', (event, data) => {
        window.mpris.songStart = new Date();
        window.mpris.songOffset = data * 1000 * 1000;
    });
    ipcMain.on('readDZPlaying', (event, data) => {
        if (data) {
            window.mpris.player.playbackStatus = Player.PLAYBACK_STATUS_PLAYING;
        } else {
            window.mpris.player.playbackStatus = Player.PLAYBACK_STATUS_PAUSED;
        }
    });
    ipcMain.on('readDZVolume', (event, data) => {
        window.mpris.player.volume = data;
    });
    ipcMain.on('readDZShuffle', (event, data) => {
        window.mpris.player.shuffle = data;
    });
    ipcMain.on('readDZRepeat', (event, data) => {
        switch (data) {
        case 0:
            window.mpris.player.loopStatus = 'None';
            break;
        case 1:
            window.mpris.player.loopStatus = 'Playlist';
            break;
        case 2:
            window.mpris.player.loopStatus = 'Track';
            break;
        }
    });
    // To initialize settings graphically
    ipcMain.handle('requestSettings', async () => {
        return window.settings.preferences;
    });
    // To set setting whenever there is a change
    ipcMain.on('setSetting', (event, key, value) => {
        window.settings.setAttribute(key, value);
    });
    // Callback of user logging in, or immediately if he's logged in
    ipcMain.handle('onLogin', async () => {
        if (loginHooked) {
            return;
        }
        loginHooked = true;
        window.initializeSettings();
    });
    ipcMain.on('resetSettings', () => {
        window.settings.clear();
    });
    ipcMain.on('download', (event, url, name, type) => {
        window.downloader.downloadURL(url, name, type);
    });
}

function isLoggedIn() {
    return loginHooked;
}

module.exports = { initIPC, isLoggedIn };
