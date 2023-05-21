const RPC = require('discord-rpc');
    
const CLIENT_ID = '1029062131326386256';

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

    setActivity(title, artist, cover, albumName, endTimeStamp, smallImageKey, smallImageText) {
        let config = {
            'details': title,
            'state': artist,
            'largeImageKey': cover,
            'largeImageText' : albumName,
            'endTimestamp' : endTimeStamp,
            'smallImageKey' : smallImageKey,
            'smallImageText' : smallImageText
        };
        this.client.setActivity(config);
    }
}

module.exports = DiscordRPC;
