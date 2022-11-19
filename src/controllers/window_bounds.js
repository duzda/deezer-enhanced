const FileManager = require('../utils/file_manager');
const { screen } = require('electron');
const exec = require('child_process').exec;

const filename = 'window_bounds.json';

const defaults = {
    bounds: {
        width: 1280,
        height: 800
    },
    maximized: false
};

class WindowBounds extends FileManager {
    constructor(window) {
        super(filename, defaults);

        const windowManager = exec('echo $XDG_CURRENT_DESKTOP');

        windowManager.stdout.on('data', (response) => {
            if (response == 'gamescope\n') {
                this.isSteamDeck = true;
            }
        });

        this.onload = () => {
            if (this.isSteamDeck) {
                window.setBounds({
                    x: 0,
                    y: 0,
                    width: 1280,
                    height: 800,
                });
                window.maximize();
                return;
            }

            const allDisplaysSummaryWidth = screen
                .getAllDisplays()
                .reduce((accumulator, { size: { width } }) => accumulator + width, 0);
            
            if (allDisplaysSummaryWidth >= this.preferences.bounds.x) {
                window.setBounds({
                    x: this.preferences.bounds.x,
                    y: this.preferences.bounds.y,
                    width: this.preferences.bounds.width,
                    height: this.preferences.bounds.height
                });
            }
            if (this.preferences.maximized) {
                window.maximize();
            }
        };
    }
}

module.exports = WindowBounds;
