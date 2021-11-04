const path = require('path');
const fs = require('fs');
const { app } = require('electron');

class FileManager {
    constructor(filename, defaults) {
        this.defaults = defaults;
        
        this.file = path.join(app.getPath('userData'), filename);

        // Callback when finished loading settings
        this.onload = () => {};
        this.finishedLoading = false;

        // Try to load user's preferences
        this.load();
    }

    save(asynchronous = true) {
        let json = JSON.stringify(this.preferences);

        if (asynchronous){
            fs.writeFile(this.file, json, 'utf-8', (err) => {
                if (err) {
                    console.error(err)
                    return;
                }

                // Preferences were successfully saved
            });
        } else {
            fs.writeFileSync(this.file, json, 'utf-8');
        }
    }
    
    load() {
        // In case we can't create a new file and can't change any of the settings
        // user will be forced to use default settings
        this.preferences = this.defaults;

        fs.access(this.file, (err) => {
            if (err) {
                this.finishedLoading = true;
                this.onload();

                // Either file is inaccessible or doesn't exist
                return
            }
            fs.readFile(this.file, 'utf-8', (err, data) => {
                this.finishedLoading = true;

                if (err) {
                    console.error(err);
                    this.onload();
                    return
                }

                try {
                    let userPreferences = JSON.parse(data);
                    for (let key in userPreferences) {
                        this.preferences[key] = userPreferences[key];
                    }
                    this.onload();

                } catch (jsonError) {
                    this.onload();
                    console.error(jsonError);
                }
            });
        });
    }
}

module.exports = FileManager;
