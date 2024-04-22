# About

An unofficial application for Deezer with enhanced features.

![app](https://github.com/duzda/deezer-enhanced/assets/25201406/4a7a2294-0c41-42c4-80e4-b4f5993673ba)
![settings](https://github.com/duzda/deezer-enhanced/assets/25201406/af71a428-e6c7-4a30-a301-2b21c9677f7d)

# Features

- Tray support
- Full MPRIS support
- Back and forward buttons
- Non-linear volume controls with scrollable volume button
- Discord Rich Presence
- Support for Steamdeck
- Automatic dark mode switching

# Where to get the app

Feel free to download the source code and build the app yourself, if that's not your prefered way of doing things, then there are also binaries available on the right side of the github website. If you're interested in pushing the app onto the snapstore, flatpak or any other platform, please reach out to me via [snapstore](https://github.com/duzda/deezer-enhanced/issues/21), [flatpak](https://github.com/duzda/deezer-enhanced/issues/22) issues or an [e-mail](https://github.com/duzda).

If you're using Arch-based Linux you may want to use aur instead, use [deezer-enhanced-bin](https://aur.archlinux.org/packages/deezer-enhanced-bin/) for binaries (suitable for most users) or [deezer-enhanced](https://aur.archlinux.org/packages/deezer-enhanced) (uses system electron). [deezer-enhanced-git](https://aur.archlinux.org/packages/deezer-enhanced-git/) for git version (contains build dependencies and more frequent but less stable updates).

# FAQ

Q: Downloads?  
A: The downloads will probably never work the same way as on Windows, to download music, use a different app, there's plenty of'em.

Q: Can I play offline files?  
A: No and it's not currently in a plan, use a different music player.  

Q: Chromecast support?  
A: As of right now, no, see [issue 33](https://github.com/duzda/deezer-enhanced/issues/33)

Q: I don't like the tray icon  
A: Tray icon is changeable system-wide via `/opt/deezer-enhanced/resources/assets/icon.png` or locally via `~/.config/deezer-enhanced/assets/icon.png`

# Build Instructions

`npm i && npm run make` # see package.json tasks

`npm i && npm start` # for running the app

# License

This application is in no way affiliated with Deezer, the source code of this application is licensed under [MIT license](LICENSE)

# Contribution

Contributions are more than welcome! Feel free to open a discussion or PR!  
Don't worry if you can't code, you can still open an issue with a bug, feature request or ask a question.
