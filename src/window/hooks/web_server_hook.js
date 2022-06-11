const WebServer = require('./../../controllers/web_server');
const IHook = require('./ihook');

class WebServerHook extends IHook {
    constructor() {
        super();
        this.func = this.setWebServer;
        this.callbackName = 'webPort';
    }

    setWebServer() {
        if (this.settings.getAttribute(this.callbackName) != 0) {
            if (!this.window.webserver) {
                this.window.webserver = new WebServer(this.window, this.settings.getAttribute('webPort'));
            } else {
                this.window.webserver.stop();
            }

            this.window.webserver.start(this.settings.getAttribute(this.callbackName));
        } else {
            this.window.webserver.stop();
        }
    }
}

module.exports = new WebServerHook();
