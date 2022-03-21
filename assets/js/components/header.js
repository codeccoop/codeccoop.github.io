document.addEventListener("DOMContentLoaded", function() {
    var $el = document.getElementById("pageHeader");
    var burger = document.querySelectorAll(".navbar-burger")[0];

    burger.addEventListener("click", function() {
        if (!burger.classList.contains("is-active")) {
            var targetId = burger.dataset.target;
            var targetEl = document.getElementById(targetId);

            burger.classList.add("is-active");
            targetEl.classList.add("is-active");
            document.addEventListener("click", onClickOut, true);
        }
    });

    function onClickOut(ev) {
        if (!$el.contains(ev.target)) {
            ev.preventDefault();
        }

        ev.stopPropagation();
        burger.classList.remove("is-active");
        document
            .getElementById(burger.dataset.target)
            .classList.remove("is-active");
        document.removeEventListener("click", onClickOut, true);

        if (!isMobile()) {
			scrollNavHandler(ev);
		}
    }

    function setActiveLink(id) {
        var items = Array.apply(null, this.getElementsByClassName("navbar-item"));
        var item = items.filter(function(item) {
            if (item.classList.contains("has-dropdown")) {
                item.children[0].classList.remove("is-active");
            } else {
                item.classList.remove("is-active");
            }
            return item.dataset.id == id;
        })[0];
		if (!item) return;
        if (item.classList.contains("has-dropdown")) {
            item.children[0].classList.add("is-active");
        } else {
            item.classList.add("is-active");
        }
    }

    $el.setActiveLink = setActiveLink.bind($el);

    var currentPage;
    var match = location.pathname.match(/\/(.*)(?=\.html)/);
    if (match) {
        var isPost = location.pathname.match(
            /\/[0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}\//
        );
        var isWorkshop = location.pathname.match(/\/workshops\/.*\.html$/);
        if (isPost) currentPage = "blog";
        else if (isWorkshop) currentPage = "workshops";
        else currentPage = match[1];
    } else if (location.hash !== "") {
        currentPage = location.hash.replace(/\#/, "");
    } else {
        if (location.pathname.match(/^\/blog\//)) currentPage = "blog";
        else currentPage = "home";
    }

    $el.setActiveLink(currentPage);

    function scrollNavHandler(ev) {
        var landingSections = ["home", "work", "team"];
        if (landingSections.includes(currentPage)) {
            if (ev.target.classList.contains("navbar-item") || ev.target.classList.contains("navbar-link")) {
                if (ev.target.href.match(/\/#/)) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    var id = ev.target.href.match(/\/#((.(?!\/))+[A-Za-z])/)[1]
                    document.getElementsByClassName("scroll-root")[0].scrollBy({
                        top: document.getElementById(id).getBoundingClientRect().top,
                        left: 0,
                        behavior: "smooth"
                    })
                }
            }
        }
    }

    if (!isMobile()) {
        var links = $el.getElementsByTagName("a");
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener("click", scrollNavHandler);
        }
    }
});
