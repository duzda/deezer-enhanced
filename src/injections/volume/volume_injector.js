/* eslint no-unused-vars: ["error", { "args": "none" }]*/
/* global dzPlayer, Bridge, Events, dataLayer */

let sliderVolume = 0.0;

// Gets called first
function pollDzPlayer() {
    if (dzPlayer != null) {
        injectSetVolume();
    } else {
        setTimeout(pollDzPlayer, 100);
    }
}

function injectSetVolume() {
    dzPlayer.getVolume = () => {
        return sliderVolume;
    };

    // e - new volume level
    // t - did user specifically click the volume bar?
    dzPlayer.control.setVolume = (e, t) => {
        try {
            if (dzPlayer.chromecast.isLoading()) {
                return !1;
            }
            // What is st?? 
            // This probably only disables setting volume while an ad is playing
            // if (st(dzPlayer.getPlayerType()))
            //    return !1;
            
            dzPlayer.isMuted() && e > 0 && dzPlayer.control.mute(!1);
            t = t || !1;
            dzPlayer.volume = e;
            sliderVolume = e;

            // volumePower is exported by another script, yet we can access it freely via Bridge
            if (!isNaN(Bridge.volumePower) && isFinite(Bridge.volumePower) && Bridge.volumePower > 0) {
                dzPlayer.trigger('audioPlayer_setVolume', [Math.pow(e, Bridge.volumePower)]);
            } else {
                dzPlayer.trigger('audioPlayer_setVolume', [e]);
            }

            Events.trigger(Events.player.volume_changed, Math.round(100 * e));
            // Disabled, to allow setting the local storage even when changed via mpris
            // if (t === true) {
            window.localStorage.setItem('volume_' + dataLayer[0].deezer_user_id, e);
            // }
        } catch (e) {
            console.error(e);
        }
    };
}

pollDzPlayer();
