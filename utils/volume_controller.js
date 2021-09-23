class VolumeController {
    static calculateDynamicVolume(currentVolume) {
        return Math.ceil(currentVolume * 100 / 10) / 100
    }
}

module.exports = VolumeController;