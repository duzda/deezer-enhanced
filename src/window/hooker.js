const DownloaderHook = require('./hooks/downloader_hook');
const LimitHook = require('./hooks/limit_hook');
const MprisHook = require('./hooks/mpris_hook');
const OptimizationHook = require('./hooks/optimization_hook');
const SettingsHook = require('./hooks/settings_hook');
const SidebarHook = require('./hooks/sidebar_hook');
const TrayHook = require('./hooks/tray_hook');
const VolumeHook = require('./hooks/volume_hook');
const VolumeScrollHook = require('./hooks/volume_scroll_hook');
const WebServerHook = require('./hooks/web_server_hook');

const Hooks = [
    DownloaderHook,
    LimitHook,
    MprisHook,
    OptimizationHook,
    SettingsHook,
    SidebarHook,
    TrayHook,
    VolumeHook,
    VolumeScrollHook,
    WebServerHook
];

function initializeHooks(window, settings) {
    Hooks.forEach(element => {
        element.initialize(window, settings);
        element.hook();
    });
}

module.exports = { initializeHooks };
