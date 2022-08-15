let onUrlChange;

function bindHistoryCallback(callback) {
    onUrlChange = callback;
}

function bindHistory() {
    // History injection
    let pushState = history.pushState;
    history.pushState = function() {
        pushState.apply(history, arguments);
        if (onUrlChange) {
            onUrlChange(arguments[2]);
        }
    };
}

module.exports = { bindHistory, bindHistoryCallback };
