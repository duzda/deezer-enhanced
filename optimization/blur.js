function animateLogo() {
    document.getElementById("dzr-app").style = "display: none;";
    document.body.style = "overflow-y: hidden;display: flex;justify-content: center;align-items: center;";
    document.getElementById('central_logo').style = "transition: opacity 1s ease-in, transform 3s ease-out;opacity: 1;transform: scale(1.0,1.0)";
}

function pollLogo() {
    var logos = document.querySelectorAll(".logo.logo-deezer-black");
    if (logos == null || logos.length < 1) {
        setTimeout(pollLogo, 100);
    } else {
        logo = logos[0].cloneNode(true);
        logo.id = "central_logo";
        logo.style = "opacity: -1;transform: scale(0,0)";
        document.body.appendChild(logo);
        // To fire animation even for the first time, should probably use something more reliable
        setTimeout(animateLogo, 100);
    }
}

var logo = document.getElementById("central_logo");
if (!logo) {
    pollLogo()
} else {
    animateLogo();
}
