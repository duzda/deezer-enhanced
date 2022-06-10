const AppTray = require('./../../controllers/app_tray');
const IHook = require('./ihook');

class TrayHook extends IHook {
    constructor() {
        super();
        this.func = this.setTray;
        this.callbackName = 'enableTray';
    }

    setTray() {
        if (this.settings.getAttribute(this.callbackName) == 'true') {
            this.window.tray = new AppTray(this.window, this.window.mpris);
        } else if (this.window.tray != null) {
            if (this.window.tray.tray != null) {
                this.window.tray.tray.destroy();
            }
            this.window.tray = null;
        }
    }
}

module.exports = new TrayHook();
