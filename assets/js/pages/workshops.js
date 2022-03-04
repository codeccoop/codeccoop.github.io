document.addEventListener("DOMContentLoaded", function() {
    var $el = document.getElementsByTagName("main")[0];

    setTimeout(function() {
        var background = new BackgroundPatterns("workshops", {
            isMobile: isMobile()
        });
        background.bind($el);
    }, 200);
});
