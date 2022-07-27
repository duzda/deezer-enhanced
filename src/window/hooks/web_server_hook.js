const WebServer = require('./../../controllers/web_server');
const IHook = require('./ihook');

class WebServerHook extends IHook {
    constructor() {
        super();
        this.func = this.setWebServer;
        this.callbackName = 'webPort';
        this.lastPort = 0;
    }

    setWebServer() {
        if (this.settings.getAttribute(this.callbackName) != 0) {
            if (!this.window.webserver) {
                this.window.webserver = new WebServer(this.window, this.settings.getAttribute(this.callbackName));
            } else {
                if (this.lastPort == this.settings.getAttribute(this.callbackName)) {
                    return;
                }

                this.window.webserver.stop();
            }

            this.lastPort = this.settings.getAttribute(this.callbackName);
            this.window.webserver.start(this.settings.getAttribute(this.callbackName));
        } else {
            if (!this.window.webserver) {
                return;
            }

            this.window.webserver.stop();
        }
    }
}

module.exports = new WebServerHook();
