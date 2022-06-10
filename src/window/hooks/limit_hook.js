const IHook = require('./ihook');

class LimitHook extends IHook {
    constructor() {
        super();
        this.func = this.checkLimitDownload;
        this.callbackName = 'downloadLimit';
    }

    // refactor once https://github.com/electron/electron/issues/21250 gets resolved
    // see https://github.com/ChromeDevTools/devtools-protocol/issues/102 as well
    async checkLimitDownload() {
        let kBpsLimit = parseInt(this.settings.getAttribute(this.callbackName));

        if (!isNaN(kBpsLimit) && kBpsLimit > 0) {
            // Atach debugger if limit is being set for the first time this session
            if (!this.window.webContents.debugger.isAttached()) {
                this.window.webContents.debugger.attach();
            }

            // Limit main and every child process
            this.limitDownload(kBpsLimit);
            this.window.webContents.debugger
                .sendCommand('Target.getTargets')
                .then((targets) => {
                    for (let i = 0, len = targets['targetInfos'].length; i < len; i++) {
                        // Get session ID
                        this.window.webContents.debugger
                            .sendCommand('Target.attachToTarget', {
                                targetId: targets['targetInfos'][i].targetId,
                                // Allow communication via session ID
                                flatten: true,
                            })
                            .then((data) => {
                                this.limitDownload(kBpsLimit, data.sessionId);
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    }
                });
        } else {
            // Detach if was attached (better than setting no limit)
            if (this.window.webContents.debugger.isAttached()) {
                this.window.webContents.debugger.detach();
            }
        }
    }

    async limitDownload(kBpsLimit, sessionId) {
    // Attach every child
        this.window.webContents.debugger
            .sendCommand(
                'Target.setAutoAttach',
                {
                    autoAttach: true,
                    waitForDebuggerOnStart: true,
                    flatten: true,
                },
                sessionId
            )
            .catch((err) => {
                console.error(err);
            });

        // Enables emulation even when devtools are not visible
        this.window.webContents.debugger
            .sendCommand('Network.enable', null, sessionId)
            .catch((err) => {
                console.error(err);
            });

        // Sets conditions
        this.window.webContents.debugger
            .sendCommand(
                'Network.emulateNetworkConditions',
                {
                    offline: false,
                    latency: 0,
                    // downloadThroughput accepts bytes
                    downloadThroughput: kBpsLimit * 1024,
                    // Documentation seems to be wrong, 0 is nolimit, -1 disables upload completly
                    uploadThroughput: 0,
                },
                sessionId
            )
            .catch((err) => {
                console.error(err);
            });
    }
}

module.exports = new LimitHook();
