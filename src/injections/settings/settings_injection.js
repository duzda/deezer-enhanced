/* global Bridge */

const path = require('path');

let injected = false;

// Gets called first
function pollTopbar() {
    let topbar = document.getElementById('page_topbar');
    if (topbar != null) {
        inject(topbar);
    } else {
        setTimeout(pollTopbar, 100);
    }
}

// Injects new button onto the top bar next to notifications
function inject(topbar) {
    let poppers = topbar.getElementsByClassName('popper-wrapper');
    if (topbar != null && poppers != null && poppers.length > 1 && poppers[1] != null) {
        Bridge.LazyReader.getOnce(path.join('injections', 'settings', 'settings-element.html'), (data) => {
            let div = document.createElement('div');
            div.className = 'popper-wrapper topbar-action';
            div.innerHTML = data;
            topbar.insertBefore(div, poppers[1]);
            initSettingsJavacript();
        });
    } else {
        console.warn('There\'s nowhere to put settings button');
    }
}

// Changes contents of site
function initSettingsJavacript() {
    let settingsButton = document.getElementById('injected_settings');
    if (settingsButton != null) {
        settingsButton.addEventListener('click', () => {
            // Removes highlight from sidebar
            let sidebar = document.getElementById('page_sidebar');
            let activeLinks = sidebar.getElementsByClassName('is-active');
            for (let i = 0, len = activeLinks.length; i < len; i++) {
                activeLinks[i].classList.remove('is-active');
            }
            
            // Proceeds with injection
            if (injected) {
                document.getElementById('app_settings').style = null;
                changeContentVisiblity(true);
                return;
            }
            
            injected = true;
            
            // Hides page content
            let pageContent = document.getElementById('page_content');
            for (let i = 0, len = pageContent.childElementCount; i < len; i++) {
                pageContent.childNodes[i].style.display = 'none';
            }
            
            // Prevents destroying DOM events and adds settings
            Bridge.LazyReader.getOnce(path.join('injections', 'settings', 'settings.html'), (data) => {
                let container = document.createElement('div');
                container.innerHTML = data;
                
                while (container.firstChild) {
                    pageContent.appendChild(container.firstChild);
                }
            });
            
            // Create script that takes care of settings    
            Bridge.LazyReader.getOnce(path.join('injections', 'settings', 'settings_deezer.js'), (data) => {
                let script = document.createElement('script');
                script.setAttribute('type', 'text/javascript');
                script.innerHTML = data;
                document.body.appendChild(script);
            });
            
            // If user clicks on profile and generates more <a> tags, we need to hook those new as well
            let profile_button = document.getElementsByClassName('topbar-profile')[0];
            profile_button.addEventListener('click', pollAccountPopper);
            
            // Hook also search bar
            let searchBar = document.getElementsByClassName('topbar-search-form')[0];
            searchBar.addEventListener('submit', onclickHideSettings);
            
            // Hook search history
            let searchInput = document.getElementById('topbar-search');
            searchInput.addEventListener('focus', pollSearchHistory);
            
            // Hook notification bell 1, because 0 is the injected settings button
            let notificationBell = document.getElementsByClassName('topbar-notification')[1];
            notificationBell.addEventListener('click', pollNotifications);
            
            bindLinks();
        });
    } else {
        console.warn('Unable to show settings currently');
    }
}

function bindLinks() {
    let all_a = document.body.getElementsByTagName('a');
    for (let i = 0, len = all_a.length; i < len; i++) {
        all_a[i].addEventListener('click', onclickHideSettings);
    }
}

// Waits for account popper to appear after clicking profile
function pollAccountPopper() {
    const account_popper = document.getElementsByClassName('popper-account');
    if (account_popper != null && account_popper.length > 0) {
        bindLinks();
    } else {
        setTimeout(pollAccountPopper, 100);
    }
}

function onclickHideSettings() {
    let app_settings = document.getElementById('app_settings');
    if (app_settings != null) {
        app_settings.style.display = 'none';
    }
    changeContentVisiblity(false);
}

// Change visibility of everything but settings
function changeContentVisiblity(hide) {
    let visibility = hide ? 'none' : '';
    let pageContent = document.getElementById('page_content');
    for (let i = 0, len = pageContent.childElementCount; i < len; i++) {
        if (pageContent.children[i].id != 'app_settings') {
            pageContent.children[i].style.display = visibility;
        }
    }
}

function pollSearchHistory() {
    let searchCategory = document.getElementsByClassName('search-category')[0];
    if (searchCategory != null) {
        bindLinks();
    } else {
        setTimeout(pollSearchHistory, 100);
    }
}

function pollNotifications() {
    let notificationsPopper = document.getElementsByClassName('popper-notifications')[0];
    if (notificationsPopper != null) {
        bindLinks();
        
        // Hook pictures as well
        let picture_links = document.body.getElementsByClassName('picture-link');
        for (let i = 0, len = picture_links.length; i < len; i++) {
            picture_links[i].addEventListener('click', onclickHideSettings);
        }
    } else {
        setTimeout(pollNotifications, 100);
    }
}

function reinject() {
    var injectedSettings = document.getElementById('injected_settings');
    if (injectedSettings == null) {
        injected = false;
        pollTopbar();
    }
}

// When comming back online try to reinject if settings are missing
window.addEventListener('online', () => {
    reinject();
});

pollTopbar();
