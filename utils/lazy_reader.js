const path = require('path');
const fs = require('fs');

/**
 *  Wrapper that reads files if it's first time accessing them,
 *  otherwise stores them in dictionary and returns the contents on demand
 *  */
class LazyReader {
    static files = {};

    /**
     * Cached, for uncached version use getOnce
     * @param {*} file 
     * @param {*} callback 
     */
    static get(file, callback) {
        this.getUniversal(file, true, callback);
    }

    static getOnce(file, callback) {
        this.getUniversal(file, false, callback);
    }

    static getUniversal(file, useCache, callback) {
        if (file in this.files) {
            callback(this.files[file]);
        }
        LazyReader.loadFile(file);
        LazyReader.asyncLoading(file, callback, useCache);
    }

    /**
     * Unloads file(s) from memory
     * @param {*} file specify which file to drop, unspecified drops all contents
     */
    static unload(file) {
        if (file == null) {
            this.files = {};
        }
        else if (file in this.files) {
            delete this.files[file];
        }
    }

    static asyncLoading(file, callback, useCache) {
        if (file in this.files) {
            callback(this.files[file]);
            if (useCache === false) {
                this.unload(file);
            }
        } else {
            setTimeout(() => {
                LazyReader.asyncLoading(file, callback, useCache);
            }, 100);
        }
    }

    static loadFile(file) {
        fs.readFile(path.join(__dirname, file), 'utf-8', (err, data) => {
            if (err) {
                console.error("An error while trying to read a file occured ", err);
                return;
            }

            this.files[file] = data;
        });
    }
}

module.exports = LazyReader;
