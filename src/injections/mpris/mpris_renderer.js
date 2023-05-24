/* global ipcRenderer, Events, dzPlayer */

if (typeof Events !== 'undefined') {
    Events.subscribe(Events.player.playerReady, function () {
        ipcRenderer.send('readDZCurPosition', dzPlayer.getPosition());
        ipcRenderer.send('readDZCurSong', dzPlayer.getCurrentSong());
    });
    Events.subscribe(Events.player.updateCurrentTrack, function () {
        ipcRenderer.send('readDZCurPosition', dzPlayer.getPosition());
        ipcRenderer.send('readDZCurSong', dzPlayer.getCurrentSong());
    });
    Events.subscribe(Events.player.trackChange, function () {
        ipcRenderer.send('readDZCurPosition', dzPlayer.getPosition());
        ipcRenderer.send('readDZCurSong', dzPlayer.getCurrentSong());
    });
    Events.subscribe(Events.player.playing, function () {
        ipcRenderer.send('readDZPlaying', dzPlayer.isPlaying());
        ipcRenderer.send('readDZCurPosition', dzPlayer.getPosition());
        ipcRenderer.send('readDZCurSong', dzPlayer.getCurrentSong());
    });
    Events.subscribe(Events.player.volume_changed, function () {
        ipcRenderer.send('readDZVolume', dzPlayer.getVolume());
    });
    Events.subscribe(Events.player.shuffle_changed, function () {
        ipcRenderer.send('readDZShuffle', dzPlayer.shuffle);
    });
    Events.subscribe(Events.player.repeat_changed, function () {
        ipcRenderer.send('readDZRepeat', dzPlayer.getRepeat());
    });
}
