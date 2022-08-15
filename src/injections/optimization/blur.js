function animateLogo() {
    document.getElementById('dzr-app').style = 'display: none;';
    document.body.style = 'overflow-y: hidden;display: flex;justify-content: center;align-items: center;';
    document.getElementById('central_logo').style = 'opacity: 1; transform: scale(1.0, 1.0)';
}

function pollLogo() {
    logo = document.createElement('span');
    logo.id = 'central_logo';
    logo.classList = 'logo logo-deezer-black';
    logo.style = 'opacity: 1; transform: scale(1.0, 1.0)';
    document.body.appendChild(logo);
    // To fire animation even for the first time, should probably use something more reliable
    setTimeout(animateLogo, 100);
}

let logo = document.getElementById('central_logo');
if (!logo) {
    pollLogo();
} else {
    animateLogo();
}
