const electron = require("electron");

if (typeof Events !== 'undefined') {
    Events.subscribe(Events.player.playerReady, function () {
        electron.ipcRenderer.send('readDZCurSong', dzPlayer.getCurrentSong())
        electron.ipcRenderer.send('readDZCurPosition', dzPlayer.getPosition());
    })
    Events.subscribe(Events.player.updateCurrentTrack, function () {
        electron.ipcRenderer.send('readDZCurSong', dzPlayer.getCurrentSong())
        electron.ipcRenderer.send('readDZCurPosition', dzPlayer.getPosition());
    })
    Events.subscribe(Events.player.trackChange, function () {
        electron.ipcRenderer.send('readDZCurSong', dzPlayer.getCurrentSong())
        electron.ipcRenderer.send('readDZCurPosition', dzPlayer.getPosition());
    })
    Events.subscribe(Events.player.playing, function () {
        electron.ipcRenderer.send('readDZPlaying', dzPlayer.isPlaying())
        electron.ipcRenderer.send('readDZCurSong', dzPlayer.getCurrentSong())
        electron.ipcRenderer.send('readDZCurPosition', dzPlayer.getPosition());
    })
    Events.subscribe(Events.player.volume_changed, function () {
        electron.ipcRenderer.send('readDZVolume', dzPlayer.getVolume())
    })
    Events.subscribe(Events.player.shuffle_changed, function () {
        electron.ipcRenderer.send('readDZShuffle', dzPlayer.shuffle)
    })
    Events.subscribe(Events.player.repeat_changed, function () {
        electron.ipcRenderer.send('readDZRepeat', dzPlayer.getRepeat())
    })
}