const path = require('path');
const LazyReader = require('./../../utils/lazy_reader');
const IHook = require('./ihook');

class VolumeHook extends IHook {
    constructor() {
        super();
        this.func = this.exportVolumePower;
        this.callbackName = 'volumePower';
    }

    initialize(window, settings) {
        super.initialize(window, settings);
        this.hookVolumeControls();
    }

    hookVolumeControls() {
        LazyReader.getOnce(path.join('injections', 'volume', 'volume_injector.js'), (data) => {
            this.window.webContents.executeJavaScript(data);
        });
    }

    exportVolumePower() {
        let volumePower = this.settings.getAttribute(this.callbackName);
        this.window.webContents.executeJavaScript(
            `Bridge.volumePower = "${volumePower}"`
        );
    }
}

module.exports = new VolumeHook();
