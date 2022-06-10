const Mpris = require('./../../controllers/mpris');
const IHook = require('./ihook');

class MprisHook extends IHook {
    constructor() {
        super();
        this.func = this.initializeMpris;
    }

    initializeMpris() {
        this.window.mpris = new Mpris(this.window);
        this.window.mpris.initMprisPlayer();
        this.window.mpris.bindEvents();
    }
}

module.exports = new MprisHook();
