class IHook {
    initialize(window, settings) {
        this.window = window;
        this.settings = settings;

        if (this.func) {
            this.func();
        }
    }

    hook() {
        if (!this.callbackName || !this.func) {
            return;
        }

        this.settings.setCallback(this.callbackName, () => { 
            this.func(); 
        });
    }
}

// In extended classes just bind this.func and this.callbackName
module.exports = IHook;
