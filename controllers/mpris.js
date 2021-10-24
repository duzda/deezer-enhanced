const Player = require('mpris-service');
const LazyReader = require('../utils/lazy_reader');

class Mpris {
    constructor(win) {
        this.win = win
        // To obtain current position
        this.songStart;
        this.songOffset;
        // For notifications, as we do not set trackid in metadata
        this.songId = 0;

        this.player = Player({
            name: 'Deezer',
            identity: 'Deezer media player',
            supportedUriSchemes: [],
            supportedMimeTypes: [],
            supportedInterfaces: ['player']
        });
    }

    initMprisPlayer() {
        // Bind the deezer events to the mpris datas
        LazyReader.getOnce('../mpris/mpris_renderer.js', (data) => {
            this.win.webContents.executeJavaScript(data)
        })

        // The function used to know when to read the Deezer track position
        // We have no clue about the position, but we can calculate that easily by knowing
        // the time when the song started and knowing the time of asking for the position
        // Seeking a position moves the offset
        this.player.getPosition = () => {
            let songCurrent = new Date();
            if (this.player.playbackStatus == Player.PLAYBACK_STATUS_PAUSED) {
                return this.songOffset;
            }
            return (songCurrent - this.songStart) * 1000 + this.songOffset;
        };

        this.player.on('quit', () => {
            process.exit();
        });
    }

    bindEvents() {
        // MPRIS side actions
        this.player.on('pause', () => {
            this.win.webContents.executeJavaScript("dzPlayer.control.pause();");
        })
        this.player.on('play', () => {
            this.win.webContents.executeJavaScript("dzPlayer.control.play();");
        })
        this.player.on('playpause', () => {
            this.win.webContents.executeJavaScript("dzPlayer.control.togglePause();");
        })
        this.player.on('loopStatus', (loop_status) => {
            let loop_status_int
            switch (loop_status) {
                case "None":
                    this.player.loopStatus = "Playlist";
                    loop_status_int = 0;
                    break;
                case "Playlist":
                    this.player.loopStatus = "Track";
                    loop_status_int = 1;
                    break;
                case "Track":
                    this.player.loopStatus = "None";
                    loop_status_int = 2;
                    break;
            };
            this.win.webContents.executeJavaScript(`dzPlayer.control.setRepeat(${loop_status_int});`);
        })
        this.player.on('shuffle', (shuffle_status) => {
            this.player.shuffle = shuffle_status;
            this.win.webContents.executeJavaScript(`dzPlayer.control.setShuffle(${shuffle_status});`);
        })
        this.player.on('next', () => {
            this.win.webContents.executeJavaScript("dzPlayer.control.nextSong();");
        })
        this.player.on('previous', () => {
            this.win.webContents.executeJavaScript("dzPlayer.control.prevSong();");
        })
        this.player.on('volume', (volume) => {
            this.win.webContents.executeJavaScript(`dzPlayer.control.setVolume(${volume});`);
        })
        // For setting the exact position(for example): playerctl position 10
        this.player.on('position', (event) => {
            // Track ID should match (currently they would always match)
            let position = event.position / 1000000;
            let length = this.player.metadata['mpris:length'] / 1000000;
            this.win.webContents.executeJavaScript(`dzPlayer.control.seek(${position / length});`);
        })
        // For setting the position(for example): playerctl position 10+
        this.player.on('seek', (offset) => {
            // Note that offset may be negative
            offset /= 1000000
            let length = this.player.metadata['mpris:length'] / 1000000;
            this.win.webContents.executeJavaScript(`dzPlayer.control.seek((dzPlayer.getPosition() + ${offset}) / ${length});`);
        });
    }

    updateMetadata(data) {
        var song = data;
        this.id = song['SNG_ID'];
        var artists = [];
        if ('ARTISTS' in song) {
            song['ARTISTS'].forEach(function (artist) {
                artists.push(artist['ART_NAME']);
            });
        } else {
            artists = [song['ART_NAME']];
        }
        this.player.metadata = {
            'mpris:trackid': this.player.objectPath('track/0'), // Setting SNG_ID causes problems, might wanna fix later though
            'mpris:length': song['DURATION'] * 1000 * 1000, // In microseconds
            'mpris:artUrl': 'https://e-cdns-images.dzcdn.net/images/cover/' + song['ALB_PICTURE'] + '/380x380-000000-80-0-0.jpg',
            'xesam:title': song['SNG_TITLE'],
            'xesam:album': song['ALB_TITLE'],
            'xesam:artist': artists
        };
    }
}

module.exports = Mpris;
