const path = require('path');
const LazyReader = require('./../../utils/lazy_reader');
const IHook = require('./ihook');

class SidebarHook extends IHook {
    constructor() {
        super();
        this.func = this.hookSidebar;
    }

    hookSidebar() {
        LazyReader.getOnce(path.join('injections', 'sidebar', 'sidebar_injection.js'), (data) => {
            this.window.webContents.executeJavaScript(data);
        });

        LazyReader.getOnce(path.join('injections', 'sidebar', 'navigation.css'), (data) => {
            this.window.webContents.insertCSS(data);
        });
    }
}

module.exports = new SidebarHook();
