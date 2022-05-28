const FileManager = require('../utils/file_manager');

const filename = 'preferences.json';

const defaults = {
    enableTray: 'true',
    closeToTray: 'true',
    optimizeApp: 'false',
    songNotifications: 'false',
    volumePower: '4',
    downloadLimit: '',
    webPort: 3000
};

class Settings extends FileManager {
    constructor() {
        super(filename, defaults);
        this.callbacks = {};
    }
    
    /**
    * Sets preference key and launches callback if any is set
    * @param {*} key 
    * @param {*} value 
    */
    setAttribute(key, value) {
        this.preferences[key] = value;
        this.save();
        if (key in this.callbacks) {
            this.callbacks[key]();
        }
    }
    
    getAttribute(key) {
        return this.preferences[key];
    }
    
    setCallback(key, callback) {
        this.callbacks[key] = callback;
    }
}

module.exports = Settings;
