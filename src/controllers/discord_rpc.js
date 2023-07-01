const RPC = require('discord-rpc');
    
const CLIENT_ID = '1029062131326386256';

const PLAY_ICON = 'https://raw.githubusercontent.com/duzda/deezer-enhanced/master/other/discord/playIcon.png';
const PAUSE_ICON = 'https://raw.githubusercontent.com/duzda/deezer-enhanced/master/other/discord/pauseIcon.png';

class DiscordRPC {
    connect() {
        this.client = new RPC.Client({
            transport: 'ipc'
        });
        this.client.login({ clientId: CLIENT_ID });
    }

    disconnect() {
        this.client.destroy();
    }

    setActivity(title, artist, cover, albumName, player) {
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
        this.client.setActivity(config);
    }
}

module.exports = DiscordRPC;
