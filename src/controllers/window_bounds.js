const FileManager = require("../utils/file_manager");
const { screen } = require('electron');

const filename = "window_bounds.json";

const defaults = {
    bounds: {
        width: 1200,
        height: 800
    },
    maximized: false
}

class WindowBounds extends FileManager {
    constructor(window) {
        super(filename, defaults);
        this.onload = () => {
            const allDisplaysSummaryWidth = screen
                .getAllDisplays()
                .reduce((accumulator, { size: { width } }) => accumulator + width, 0)

            if (allDisplaysSummaryWidth >= this.preferences.bounds.x) {
                window.setBounds({
                    x: this.preferences.bounds.x,
                    y: this.preferences.bounds.y,
                    width: this.preferences.bounds.width,
                    height: this.preferences.bounds.height
                })
            }
            if (this.preferences.maximized) {
                window.maximize()
            }
        }
    }
}

module.exports = WindowBounds;
