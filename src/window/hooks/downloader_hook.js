const { session } = require('electron');
const Downloader = require('./../../controllers/downloader');
const IHook = require('./ihook');

class DownloaderHook extends IHook {
    constructor() {
        super();
        this.func = this.initializeDownloader;
        this.callbackName = 'deemixIntegration';
    }

    initializeDownloader() {
        if (this.window.downloader) {
            return;
        }

        const cookie = { url: 'https://www.deezer.com', name: 'arl' };
        if (this.settings.getAttribute(this.callbackName) == 'true') {
            session.defaultSession.cookies.get(cookie).then((arlCookie) => {
                this.window.downloader = new Downloader(this.window, arlCookie[0].value);
            }, (error) => {
                console.error(error);
            });
        }
    }
}

module.exports = new DownloaderHook();

