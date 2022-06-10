const path = require('path');
const LazyReader = require('./../../utils/lazy_reader');
const IHook = require('./ihook');

class VolumeScrollHook extends IHook {
    constructor() {
        super();
        this.func = this.hookScroll;
    }

    hookScroll() {
        LazyReader.getOnce(path.join('injections', 'volume', 'scroll_injector.js'), (data) => {
            this.window.webContents.executeJavaScript(data);
        });
    }
}

module.exports = new VolumeScrollHook();
