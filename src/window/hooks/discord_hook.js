const DiscordRPC = require('../../controllers/discord_rpc');
const IHook = require('./ihook');

class DiscordHook extends IHook {
    constructor() {
        super();
        this.func = this.settingChange;
        this.callbackName = 'discordRPC';
    }

    settingChange() {
        if (this.settings.getAttribute(this.callbackName) == 'true') {
            this.window.discordRPC = new DiscordRPC();
            this.window.discordRPC.connect();
        } else {
            if (this.window.discordRPC) {
                this.window.discordRPC.disconnect();
            }
            this.window.discordRPC = null;
        }
    }
}

module.exports = new DiscordHook();
