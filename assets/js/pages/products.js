document.addEventListener("DOMContentLoaded", function() {
    var rootEl = document.getElementsByTagName("main")[0];

    setTimeout(function() {
        var background = new BackgroundPatterns("products", {
            isMobile: isMobile()
        });
        background.bind(rootEl);
    }, 0);

	var description
	var descriptions = document.getElementsByClassName("products__product-toggle");
	for (var i=0; i<descriptions.length; i++) {
		function toggleVisibility (ev) {
			if (!ev.target.classList.contains("products__product-description")) {
				ev.currentTarget.classList.toggle("open");
				if (ev.currentTarget.classList.contains("open")) {
					ev.currentTarget.setAttribute("aria-pressed", "true");
					ev.currentTarget.setAttribute("aria-expanded", "true");
				} else {
					ev.currentTarget.setAttribute("aria-pressed", "false");
					ev.currentTarget.setAttribute("aria-expanded", "false");
				}
			}
		}

		function bindToEnter (fn, keyCode) {
			return function (ev) {
				if (ev.keyCode === keyCode) {
					fn(ev);
				}
			}
		}

		descriptions[i].addEventListener("click", toggleVisibility);
		descriptions[i].addEventListener("keydown", bindToEnter(toggleVisibility, 13));
	}
});
