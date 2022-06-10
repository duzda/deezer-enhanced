const path = require('path');
const LazyReader = require('./../../utils/lazy_reader');
const IHook = require('./ihook');

class OptimizationHook extends IHook {
    constructor() {
        super();
        this.func = this.checkOptimize;
        this.callbackName = 'optimizeApp';
    }

    checkOptimize() {
        if (this.settings.getAttribute(this.callbackName) == 'true') {
            this.window.addListener('blur', this.blurWindow);
            this.window.addListener('focus', this.focusWindow);
        } else {
            this.window.removeListener('blur', this.blurWindow);
            this.window.removeListener('focus', this.focusWindow);
            LazyReader.unload(path.join('injections', 'optimization', 'blur.js'));
            LazyReader.unload(path.join('injections', 'optimization', 'focus.js'));
        }
    }

    blurWindow() {
        LazyReader.get(path.join('injections', 'optimization', 'blur.js'), (data) => {
            this.webContents.executeJavaScript(data);
        });
    }

    focusWindow() {
        LazyReader.get(path.join('injections', 'optimization', 'focus.js'), (data) => {
            this.webContents.executeJavaScript(data);
        });
    }
}

module.exports = new OptimizationHook();
