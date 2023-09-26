const path = require('path');
const LazyReader = require('../../utils/lazy_reader');
const IHook = require('./ihook');

class ThemeHook extends IHook {
    constructor() {
        super();
    }

    initialize(window, settings) {
        super.initialize(window, settings);
        this.hookThemeControls(window);
    }

    hookThemeControls(window) {
        LazyReader.getOnce(path.join('injections', 'theme', 'theme_injector.js'), (data) => {
            window.webContents.executeJavaScript(data);
            window.webContents.executeJavaScript("pollTheme("+ (window.initialTheme == "dark" ? 1 : 0) +")");
        });
    }
}

module.exports = new ThemeHook();
