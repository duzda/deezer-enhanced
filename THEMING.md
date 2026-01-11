# Theming

It's possible to override Deezer themes with one of your own, you can do that by creating `style.css` in `~/.config/deezer-enhanced`. The file will automatically picked up on the next start of the application. The file is watched and hot reloaded, however if you rename the file, you need to restart the application (for example `vim` does renaming for you, so you need to choose editor that edits files in-place). To enable this feature you need to have [inotify](https://man7.org/linux/man-pages/man7/inotify.7.html) installed on your machine. It's good idea to start Deezer Enhanced via terminal, so you can read the logs.

The styles for the custom bar are derived from Deezer styles, to edit those, the following properties have to be set:

```
:root {
    --background-primary: #ff0000 !important; /* background */
    --background-secondary: #ffff00 !important; /* modal background */
    --text-primary: #00ffff !important; /* content-color active */
    --text-intermediate: #0000ff !important; /* content-color inactive */
    --tempo-colors-background-accent-primary-default: #ff00ff !important; /* accent */
    --divider-secondary: #ffffff !important; /* borders */
}
```

The Deezer styles can be edited to your liking, it's recommended to use `!important`, to take precedence.
