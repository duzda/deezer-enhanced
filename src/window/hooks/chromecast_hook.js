const path = require('path');
const LazyReader = require('../../utils/lazy_reader');
const IHook = require('./ihook');

class ChromecastHook extends IHook {
    constructor() {
        super();
        this.func = this.hideChromecast;
    }

    hideChromecast() {
        LazyReader.get(path.join('injections', 'chromecast', 'hidechromecast.js'), (data) => {
            this.window.webContents.executeJavaScript(data);
        });
    }
}

module.exports = new ChromecastHook();
