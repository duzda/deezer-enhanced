var logo = document.getElementById("central_logo");
var app = document.getElementById("dzr-app")

if (logo) {
    logo.style = "opacity: -1;transform: scale(0,0)";
}
if (app) {
    app.style = "display: block;";
    document.body.style = "overflow-y: scroll;";
}
