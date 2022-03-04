document.addEventListener("DOMContentLoaded", function() {
    var $el = document.getElementsByTagName("main")[0];

	setTimeout(function () {
		var background = new BackgroundPatterns("projects", {
			isMobile: isMobile()
		});
		background.bind($el);
	}, 200);
});
