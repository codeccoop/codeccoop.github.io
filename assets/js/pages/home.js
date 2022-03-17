document.addEventListener("DOMContentLoaded", function() {
    var $el = document.getElementsByTagName("main")[0];
    var sectionScroller = new SectionSnapScroller($el, {
        sectionClass: "home__section",
        debug: false,
        behavior: "mandatory",
        onSectionUpdate: function(sectionId) {
            document.getElementById("pageHeader").setActiveLink(sectionId);
        },
    });

    setTimeout(function() {
        var homeBg = new BackgroundPatterns("home", {
            isMobile: isMobile()
        });
        homeBg.bind(document.getElementById("home"));

        var workBg = new BackgroundPatterns("work", {
            isMobile: isMobile()
        });
        workBg.bind(document.getElementById("work"));

        var teamBg = new BackgroundPatterns("team", {
            isMobile: isMobile()
        });
        teamBg.bind(document.getElementById("team"));
    }, 200);

    var description
    var descriptions = document.getElementsByClassName("us__information-toggle");
    for (var i = 0; i < descriptions.length; i++) {
        function toggleVisibility(ev) {
            if (!ev.target.classList.contains("us__information-description")) {
                ev.currentTarget.classList.toggle("open");
                if (ev.currentTarget.classList.contains("open")) {
                    ev.target.setAttribute("aria-pressed", "true");
                    ev.currentTarget.setAttribute("aria-expanded", "true");
                } else {
                    ev.target.setAttribute("aria-pressed", "false");
                    ev.currentTarget.setAttribute("aria-expanded", "false");
                }
                var teamBg = new BackgroundPatterns("team", {
                    isMobile: isMobile()
                });
                teamBg.bind(document.getElementById("team"))
            }
        }

        function bindToEnter(fn, keyCode) {
            return function(ev) {
                if (ev.keyCode === keyCode) {
                    fn(ev);
                }
            }
        }

        descriptions[i].addEventListener("click", toggleVisibility);
        descriptions[i].addEventListener("keydown", bindToEnter(toggleVisibility, 13));
    }

	var profiles = $el.getElementsByClassName("home__profiles-wrapper")[0]
	if (isMobile()) {
		function onTouchStart () {
			profiles.removeEventListener("touchstart", onTouchStart);
			profiles.addEventListener("touchend", onTouchEnd);
			profiles.classList.add("as-text");
		}

		function onTouchEnd () {
			profiles.addEventListener("touchstart", onTouchStart);
			profiles.removeEventListener("touchend", onTouchEnd);
			profiles.classList.remove("as-text");
		}

		profiles.addEventListener("touchstart", onTouchStart);
	} else {
		function onMouseOver () {
			profiles.removeEventListener("mouseover", onMouseOver);
			profiles.addEventListener("mouseout", onMouseOut)
			profiles.classList.add("as-text");
		}

		function onMouseOut () {
			profiles.addEventListener("mouseover", onMouseOver);
			profiles.removeEventListener("mouseout", onMouseOut);
			profiles.classList.remove("as-text");
		}
		profiles.addEventListener("mouseover", onMouseOver);
	}
});
