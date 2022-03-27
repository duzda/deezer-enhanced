function bindEvent(el) {
    el = el.parentElement;
    el.addEventListener('wheel', function(e) {
        dzPlayer.control.setVolume(Math.min(Math.max(dzPlayer.getVolume() + e.deltaY * -0.0005660377358, 0.0), 1.0));
        e.preventDefault();
    });
}

setTimeout(() => {
    // First we need to reference the volume button
    let elements_mute = document.querySelectorAll('[data-testid=volume-mute]');
    let elements_unmute = document.querySelectorAll('[data-testid=volume-unmute]');

    // Bind the on scroll event to the button
    elements_mute.forEach(el => bindEvent(el));
    elements_unmute.forEach(el => bindEvent(el));
}, 1000);