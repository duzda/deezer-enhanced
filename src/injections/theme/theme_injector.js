function pollTheme(dark) {
    console.log("Polling for theme "+dark)
    if (document.querySelector("html") != null &&
        document.querySelector("html").dataset["theme"] != undefined) {
        console.log("Success")
        setTheme(dark);
    } else {
        console.log("Failed")
        setTimeout(pollTheme.bind(null, dark), 1000);
    }
}

// 0 - theme changed, 2 - error
function setTheme(dark) {
    if (document.querySelector("html") == undefined ||
            document.querySelector("html").dataset["theme"] == undefined) {
        console.log("Couldn't find html tag or theme dataset")
        return 2
    }

    if (dark) {
        document.querySelector("html").dataset["theme"] = "dark"
        document.querySelector("html").style = "color-scheme: dark;"
    } else {
        document.querySelector("html").dataset["theme"] = "light"
        document.querySelector("html").style = "color-scheme: light;"
    }
    return 0
}