/* global Bridge, path */

(function() {
    function pollSidebar() {
        let sidebar = document.getElementById('page_sidebar');
        if (sidebar) {
            hideDeezerLogo(sidebar);
            embedNavigation(sidebar);
        } else {
            setTimeout(pollSidebar, 100);
        }
    }

    function hideDeezerLogo(sidebar) {
        let headerLogo = sidebar.getElementsByClassName('sidebar-header-logo')[0];
        headerLogo.style = 'display: none';
    }

    function embedNavigation(sidebar) {
        Bridge.LazyReader.getOnce(path.join('injections', 'sidebar', 'navigation.html'), (data) => {
            let controlsElement = document.createElement('div');
            controlsElement.innerHTML = data;
            sidebar.insertBefore(controlsElement, sidebar.firstChild);
        });

        Bridge.LazyReader.getOnce(path.join('injections', 'sidebar', 'navigation.js'), (data) => {
            let script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.innerHTML = data;
            document.body.appendChild(script);
        });
    }

    pollSidebar();
})();
