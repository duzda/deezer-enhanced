# About

Deezer application primarly, but not only, for Linux that is not just an electron wrapper, but also enhances features.

![settings](https://user-images.githubusercontent.com/25201406/182014977-0dddd224-27ba-41cd-912c-0e11738293cc.png)

# Features

- Tray support
- Full MPRIS support
- Back and forward buttons
- Non-linear volume controls with scrollable volume button
- Remote controls on the same network
- Discord Rich Presence
- Support for Steamdeck
- More to come

# Where to get the app

Feel free to download the source code and build the app yourself, if that's not your prefered way of doing things, then there are also binaries available on the right side of the github website. If you're interested in pushing the app onto the snapstore, flatpak or any other platform, please reach out to me via [snapstore](https://github.com/duzda/deezer-enhanced/issues/21), [flatpak](https://github.com/duzda/deezer-enhanced/issues/22) issues or an [e-mail](https://github.com/duzda).

If you're using Arch-based Linux you may want to use aur instead, use [deezer-enhanced-bin](https://aur.archlinux.org/packages/deezer-enhanced-bin/) for binaries (suitable for most users) or [deezer-enhanced](https://aur.archlinux.org/packages/deezer-enhanced) (uses system electron). [deezer-enhanced-git](https://aur.archlinux.org/packages/deezer-enhanced-git/) for git version (contains build dependencies and more frequent but less stable updates).

# FAQ

Q: Downloads?  
A: The downloads will probably never work the same way as on Windows, to download the music, use different app, there's plenty of'em.

Q: Can I play offline files?  
A: No and it's not currently in a plan, use a different music player.  

Q: Chromecast support?  
A: As of right now, no, see [issue 33](https://github.com/duzda/deezer-enhanced/issues/33)

Q: Why don't you fix x or implement y?  
A: [Open an issue](https://github.com/duzda/deezer-enhanced/issues/new), or let me know via an [e-mail](https://github.com/duzda), I probably just don't know about it.

Q: I don't like the tray icon  
A: Tray icon is changeable system-wide via /opt/Deezer Enhanced/resources/assets or locally via ~/.config/deezer-enhanced/assets (you have to create this folder)  

# Build Instructions

`yarn && yarn minify-webcss && yarn build:target` # see package.json tasks

`yarn && yarn minify-webcss && yarn start` # for running the app

minify-webcss is required only if you plan on using the remote controls

npm works as well, yarn is just the prefered way

# License

This application is in no way affiliated with Deezer, the source code of this application is licensed under [MIT license](LICENSE)

# Contribution

Before contributing please follow [naming conventions](https://www.w3schools.com/js/js_conventions.asp)  

How the codebase works:

1. The code that gets injected into the browser process, is located in the src/injections folder.
2. Injections get injected via hooks, stored in src/window/hooks, to enable any new hook you must add the hook to the hooker.js file as well.
3. Hooks get executed **after** user logs in, if you need something to happen before the user logs in, see src/injections/login_injection.js.
4. Every hook must have func variable, this function gets executed when user logs in, if callbackName is provided, it gets also executed, whenever setting with callbackName gets executed.
5. If you require new functionality in the main process, use src/controllers or src/utils folder. Please try to avoid bloating app.js and window.js.
6. Remote control codebase is stored in src/web folder.

Nevertheless every piece of code is helpfull, feel free to open any PR!