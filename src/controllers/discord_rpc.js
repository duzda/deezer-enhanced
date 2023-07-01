const RPC = require('discord-rpc');
    
const CLIENT_ID = '1029062131326386256';

const PLAY_ICON = 'https://raw.githubusercontent.com/duzda/deezer-enhanced/master/other/discord/playIcon.png';
const PAUSE_ICON = 'https://raw.githubusercontent.com/duzda/deezer-enhanced/master/other/discord/pauseIcon.png';

class DiscordRPC {
    connect() {
        this.logIn();
    }

    disconnect() {
        this.client.destroy();
    }
    
    async logIn() {
        this.client = new RPC.Client({
            transport: 'ipc'
        });

        await this.client.login({ clientId: CLIENT_ID }).then(() => {
            this.loggedIn = true;
            console.warn('Found Discord!');
        }).catch(() => {
            this.loggedIn = false;
            console.warn('Unable to communicate with Discord');
        });
    }

    async setActivity(title, artist, cover, albumName, player) {
        const current = Date.now();
        const position = player.getPosition() / 1000;
        const startTimeStamp = player.isPlaying() ? (current - position) : null;
        const smallImageKey = player.isPlaying() ? PLAY_ICON : PAUSE_ICON;
        const smallImageText = player.isPlaying() ? 'Playing' : 'Paused';

        let config = {
            'details': title,
            'state': artist,
            'startTimestamp': startTimeStamp,
            'largeImageKey': cover,
            'largeImageText': albumName,
            'smallImageKey': smallImageKey,
            'smallImageText': smallImageText
        };

        if (!this.loggedIn) {
            await this.logIn();
        } 

        this.client.setActivity(config).catch(() => {
            console.warn('Unable to set Discord activity');
        });
    }
}

module.exports = DiscordRPC;
