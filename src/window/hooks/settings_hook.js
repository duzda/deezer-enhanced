const path = require('path');
const LazyReader = require('./../../utils/lazy_reader');
const IHook = require('./ihook');

class SettingsHook extends IHook {
    constructor() {
        super();
        this.func = this.hookSettings;
    }

    hookSettings() {
        LazyReader.getOnce(path.join('injections', 'settings', 'settings_injection.js'), (data) => {
            this.window.webContents.executeJavaScript(data);
        });

        LazyReader.getOnce(path.join('injections', 'settings', 'settings.css'), (data) => {
            this.window.webContents.insertCSS(data);
        });
    }
}

module.exports = new SettingsHook();
