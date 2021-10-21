# About

Deezer application primarly, but not only, for Linux that is not just an electron wrapper.

Currently after logging in, it's preferred to restart the application, to properly bind MPRIS actions.

![settings](https://user-images.githubusercontent.com/25201406/133940690-ce372bf5-7eab-45d6-b8a4-d3d998af3149.png)

# Features

- Custom easily expandable settings
- Full MPRIS support
- More to come

# Where to get the app

Feel free to download the source code and build the app yourself, if that's not your prefered way of doing things, then there are also binaries available on the right side of the github website.

If you're using Arch-based Linux you may want to use aur instead, if so, look for deezer-enhanced-git for git version (contains build dependencies), and deezer-enhanced-bin for binaries (suitable for most users).

# Build Instructions

`yarn && yarn build:target` # see package.json tasks

`yarn && yarn start` # for running the app

npm works as well, yarn is just the prefered way

# License

This application is in no way affiliated with Deezer, the source code of this application is licensed under [MIT license](LICENSE)

# Contribution

Before contributing please follow [naming conventions](https://www.w3schools.com/js/js_conventions.asp)  

How to add custom settings:  
1. Add html to settings.html, it's preferable to match id with the variable
2. Add settings.js's defaults variable in controllers
3. Edit settings_deezer.js don't forget initialization 
4. See window_settings.js for binding the event properly
5. Add whatever logic you like, just see settings.js's methods setAttribute and getAttribute