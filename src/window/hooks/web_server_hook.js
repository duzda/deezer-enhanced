const WebServer = require('./../../controllers/web_server');
const IHook = require('./ihook');

class WebServerHook extends IHook {
    constructor() {
        super();
        this.func = this.startWebServer;
    }

    startWebServer() {
        this.window.webserver = new WebServer(this.window, this.settings.getAttribute('webPort'));
    }
}

module.exports = new WebServerHook();
