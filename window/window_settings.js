const path = require('path');
const LazyReader = require('../utils/lazy_reader');
const AppTray = require('../controllers/app_tray');

class WindowSettings {
    constructor(window, settings, tray, webContents) {
        this.window = window;
        this.settings = settings;
        this.tray = tray;
        this.webContents = webContents;

        this.initializeSettings();
    }

    initializeSettings() {
        if (this.settings.finishedLoading) {
             this.checkOptimize();
            this.setTray();

            this.settings.setCallback("optimizeApp", () => {
                this.checkOptimize();
            });
            this.settings.setCallback("downloadLimit", () => {
                this.checkLimitDownload();
            });
            this.settings.setCallback('enableTray', () => {
                this.setTray();
            });
            this.settings.setCallback('useRoundIcon', () => {
                this.useRoundIcon();
            });

            // Bootstrap after a few seconds to let all the workers initialize (maybe log events instead?)
            setTimeout(() => {
                this.checkLimitDownload();
            }, 5000);
        } else {
            this.settings.onload = () => {
                this.initializeSettings();
            }
        }
    }

    // refactor once https://github.com/electron/electron/issues/21250 gets resolved
    // see https://github.com/ChromeDevTools/devtools-protocol/issues/102 as well
    async checkLimitDownload() {
        let kBpsLimit = parseInt(this.settings.getAttribute('downloadLimit'));

        if (!isNaN(kBpsLimit) && kBpsLimit > 0) {
            // Atach debugger if limit is being set for the first time this session
            if (!this.webContents.debugger.isAttached()) {
                this.webContents.debugger.attach();
            }

            // Limit main and every child process
            this.limitDownload(kBpsLimit);
            this.webContents.debugger.sendCommand('Target.getTargets').then((targets) => {
                for (let i = 0, len = targets['targetInfos'].length; i < len; i++) {
                    // Get session ID
                    this.webContents.debugger.sendCommand('Target.attachToTarget', {
                        targetId: targets['targetInfos'][i].targetId,
                        // Allow communication via session ID
                        flatten: true
                    }).then((data) => {
                        this.limitDownload(kBpsLimit, data.sessionId)
                    }).catch((err) => {
                        console.error(err);
                    });
                }
            });
        } else {
            // Detach if was attached (better than setting no limit)
            if (this.webContents.debugger.isAttached()) {
                this.webContents.debugger.detach();
            }
        }
    }

    async limitDownload(kBpsLimit, sessionId) {
        // Attach every child
        this.webContents.debugger.sendCommand('Target.setAutoAttach', {
            autoAttach: true,
            waitForDebuggerOnStart: true,
            flatten: true
        }, sessionId).catch((err) => {
            console.error(err);
        });

        // Enables emulation even when devtools are not visible
        this.webContents.debugger.sendCommand('Network.enable', null, sessionId)
            .catch((err) => {
                console.error(err);
            });

        // Sets conditions
        this.webContents.debugger.sendCommand('Network.emulateNetworkConditions', {
            offline: false,
            latency: 0,
            // downloadThroughput accepts bytes
            downloadThroughput: kBpsLimit * 1024,
            // Documentation seems to be wrong, 0 is nolimit, -1 disables upload completly
            uploadThroughput: 0
        }, sessionId).catch((err) => {
            console.error(err);
        });
    }

    checkOptimize() {
        if (this.settings.getAttribute("optimizeApp") == 'true') {
            this.window.addListener("blur", this.blurWindow);
            this.window.addListener("focus", this.focusWindow);
        } else {
            this.window.removeListener("blur", this.blurWindow);
            this.window.removeListener("focus", this.focusWindow);
            if (this.window.blur) {
                this.focusWindow();
            }
            LazyReader.unload(path.join("..", "optimization", "blur.js"));
            LazyReader.unload(path.join("..", "optimization", "focus.js"));
        }
    }

    blurWindow() {
        LazyReader.get(path.join("..", "optimization", "blur.js"), (data) => {
            this.webContents.executeJavaScript(data);
        });
    }

    focusWindow() {
        LazyReader.get(path.join("..", "optimization", "focus.js"), (data) => {
            this.webContents.executeJavaScript(data);
        });
    }

    setTray() {
        if (this.settings.getAttribute("enableTray") == 'true') {
            this.tray = new AppTray(this.window, this.window.app.mpris);
        } else if (this.tray != null) {
            this.tray.tray.destroy();
            this.tray = null;
        }
    }

    useRoundIcon() {
        if (this.settings.getAttribute("useRoundIcon") == 'true') {
            const { exec } = require("child_process");

            exec("cp /usr/share/applications/deezer-enhanced.desktop /home/$USER/.local/share/applications && wget -P /home/$USER/.local/share/icons/hicolor/scalable/apps https://raw.githubusercontent.com/fischer-felix/deezer-enhanced/master/assets/deezer-round.svg && sed -i 's/Icon=deezer-enhanced/Icon=deezer-round/g' /home/$USER/.local/share/applications/deezer-enhanced.desktop", (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
        } else {
            const { exec } = require("child_process");

            exec("pkexec sed -i 's/Icon=deezer-round/Icon=deezer-enhanced/g' /usr/share/applications/deezer-enhanced.desktop", (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
        }
    }
}

module.exports = WindowSettings;
