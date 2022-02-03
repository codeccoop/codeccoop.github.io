document.addEventListener("DOMContentLoaded", function () {
  var headerHeight = 0;
  var rootEl = document.getElementsByTagName("main")[0];
  var scrollViewport = setupScrollViewport();
  var sections = Array.apply(
    null,
    document.getElementsByClassName("home__section")
  ).map((el) => el.id);

  var currentSectionEl =
    document.getElementById(location.hash.replace(/#/, "")) ||
    getCurrentSection();
  var currentSection = currentSectionEl.id;
  location.hash = currentSection;

  var sectionBox = currentSectionEl.getBoundingClientRect();
  rootEl.scrollBy(0, sectionBox.top - headerHeight);
  scrollViewport.scrollBy(0, sectionBox.top - headerHeight);
  setTimeout(function () {
    var height = getSectionsTotalHeight();
    scrollViewport.firstElementChild.style.height = height + "px";
  }, 100);
  var scrollDelay = false;

  function getCurrentSection() {
    return Array.apply(
      null,
      document.getElementsByClassName("home__section")
    ).reduce(function (focused, sectionEl) {
      var acum_top = focused ? focused.getBoundingClientRect().top : 1e5;
      var n_top = sectionEl.getBoundingClientRect().top;

      if (Math.abs(n_top) < Math.abs(acum_top)) {
        return sectionEl;
      } else {
        return focused;
      }
    }, null);
  }

  function getCurrentSectionOverflow(direction) {
    var overflow;
    var sectionEl = document.getElementById(currentSection);
    var sectionBox = sectionEl.getBoundingClientRect();
    if (direction > 0) {
      overflow = Math.floor(
        sectionBox.height + sectionBox.top - window.innerHeight
      );
      return Math.abs(overflow) <= 5 ? 0 : overflow;
    } else {
      overflow = Math.floor(sectionBox.top);
      return Math.abs(overflow) <= 5 ? 0 : overflow;
    }
  }

  function scrollTo(id) {
    var el = document.getElementById(id);
    var scrollOrder = {
      left: 0,
      top: el.getBoundingClientRect().top - headerHeight,
      behavior: "smooth",
    };

    rootEl.scrollBy(scrollOrder);

    var offset = 0;
    function scrollTransition() {
      var step;
      if (scrollOrder.top > 0) {
        step = Math.min(20, scrollOrder.top - offset);
      } else {
        step = Math.max(-20, scrollOrder.top + offset);
      }
      scrollViewport.scrollBy(0, step);
      offset += step;
      if (
        (step > 0 && offset < scrollOrder.top) ||
        (step < 0 && offset > scrollOrder.top)
      ) {
        setTimeout(scrollTransition, 5);
      }
    }
    scrollTransition();
    // scrollViewport.scrollBy(scrollOrder);
    // scrollViewport.scrollBy(0, scrollOrder.top);

    currentSection = id;
    history.replaceState({ from: location.hash }, "", "/#" + id);
    document.getElementById("pageHeader").setActiveLink(currentSection);

    var debounced;
    function onScrollEnd() {
      rootEl.removeEventListener("scroll", whileScroll);
    }

    function whileScroll() {
      clearTimeout(debounced);
      debounced = setTimeout(onScrollEnd, 150);
    }

    rootEl.addEventListener("scroll", whileScroll);
    setTimeout(function () {
      scrollDelay = false;
    }, 5e2);
    scrollDelay = true;
  }

  var onScroll = (function () {
    var delayer, startEvent;

    function callback() {
      var toId;
      if (startEvent.deltaY > 0) {
        toId = sections[sections.indexOf(currentSection) + 1];
      } else {
        toId = sections[sections.indexOf(currentSection) - 1];
      }

      if (toId) {
        scrollTo(toId);
      }
    }

    return function (ev) {
      if (scrollDelay === true) return;
      var direction = ev.deltaY < 0 ? -1 : 1;
      var overflow = getCurrentSectionOverflow(direction);
      if (overflow != 0) {
        var scrollOffset =
          direction === 1
            ? Math.min(overflow, ev.deltaY)
            : Math.max(overflow, ev.deltaY);
        rootEl.scrollBy(0, scrollOffset);
        scrollViewport.scrollBy(0, scrollOffset);
        if (scrollOffset === overflow) {
          setTimeout(function () {
            scrollDelay = false;
          }, 2e2);
          scrollDelay = true;
        }
      } else {
        startEvent = ev;
        clearTimeout(delayer);
        delayer = setTimeout(callback, 50);
      }
    };
  })();

  var onSwipe = (function () {
    var swipped = false;
    var startY, deltaY, direction;

    function onTouchMove(ev) {
      var currentY = ev.changedTouches[0].screenY;
      deltaY = startY - currentY;
      direction = currentY > startY ? -1 : 1;
      var sectionOverflow = getCurrentSectionOverflow(direction);

      if (sectionOverflow != 0) {
        var scrollOffset =
          direction === 1
            ? Math.min(sectionOverflow, deltaY)
            : Math.max(sectionOverflow, deltaY);
        rootEl.scrollBy(0, scrollOffset);
        scrollViewport.scrollBy(0, scrollOffset);
        if (scrollOffset === sectionOverflow) {
          /* setTimeout(function () {
            scrollDelay = false;
          }, 5e2); */
          scrollDelay = true;
        } else {
          scrollDelay = false;
        }
        startY = currentY;
      }
      swipped = true;
    }

    function onTouchEnd(ev) {
      document.removeEventListener("touchend", onTouchEnd);
      if (swipped === false) return;
      if (scrollDelay === true) {
        scrollDelay = false;
        return;
      }

      var sectionOverflow = getCurrentSectionOverflow(direction);

      if (sectionOverflow == 0) {
        var toId;
        if (direction > 0) {
          toId = sections[sections.indexOf(currentSection) + 1];
        } else {
          toId = sections[sections.indexOf(currentSection) - 1];
        }

        if (toId) {
          scrollTo(toId, deltaY * -1);
        }
      }

      startY = void 0;
      deltaY = void 0;
      direction = void 0;
      swipped = false;
    }

    return function (ev) {
      // if (scrollDelay === true) return;
      startY = ev.changedTouches[0].screenY;
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("touchend", onTouchEnd);
    };
  })();

  document.addEventListener("wheel", onScroll);
  document.addEventListener("touchstart", onSwipe);

  function onPopState() {
    currentSection = location.hash.replace(/#/, "");
    document.getElementById("pageHeader").setActiveLink(currentSection);
    var currentSectionEl = document.getElementById(currentSection);
    var sectionBox = currentSectionEl.getBoundingClientRect();
    scrollViewport.scrollBy(0, sectionBox.top - headerHeight);
  }

  window.addEventListener("popstate", onPopState);

  function setupScrollViewport() {
    var scrollViewport = document.createElement("div");
    scrollViewport.classList.add("home__scroll-viewport");
    var scrollVeil = document.createElement("div");
    scrollVeil.classList.add("home__scroll-veil");

    var height = getSectionsTotalHeight();
    window.addEventListener("resize", function () {
      height = getSectionsTotalHeight();
      scrollVeil.style.height = height + "px";
    });

    scrollVeil.style.height = height + "px";
    scrollViewport.appendChild(scrollVeil);
    rootEl.appendChild(scrollViewport);
    return scrollViewport;
  }

  function getSectionsTotalHeight() {
    var height = 0;
    for (var i = 0; i < rootEl.childElementCount; i++) {
      if (rootEl.children[i].classList.contains("home__scroll-viewport")) {
        continue;
      }
      height += rootEl.children[i].clientHeight;
    }
    return height;
  }
});
