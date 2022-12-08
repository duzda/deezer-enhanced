(function() {
    function disableChromecastButton(chromecastIcon) {
        for (let i = 0; i < 2; i++) {
            if (!chromecastIcon.parentElement) {
                return;
            }

            chromecastIcon = chromecastIcon.parentElement;
        }

        chromecastIcon.remove();
    }

    function pollHideChromecast() {
        let chromecastList = document.getElementsByClassName('svg-icon-chromecast');
        if (chromecastList.length > 0 && chromecastList[0]) {
            disableChromecastButton(chromecastList[0]);
        } else {
            setTimeout(pollHideChromecast, 100);
        }
    }

    pollHideChromecast();
})();
