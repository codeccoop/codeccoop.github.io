document.addEventListener("DOMContentLoaded", function() {
    var rootEl = document.getElementsByTagName("main")[0];

    setTimeout(function() {
        var background = new BackgroundPatterns("workshops", {
            isMobile: isMobile()
        });
        background.bind(rootEl);
    }, 0);
});
