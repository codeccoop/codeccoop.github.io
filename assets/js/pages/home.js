document.addEventListener("DOMContentLoaded", function () {
  var headerHeight = 0; // document.getElementsByTagName("header")[0].offsetHeight;
  var rootEl = document.getElementsByTagName("main")[0];
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
    var sectionEl = document.getElementById(currentSection);
    var sectionBox = sectionEl.getBoundingClientRect();
    debugger;
    if (direction > 0) {
      // console.log(sectionBox.bottom);
      // return sectionBox.bottom - window.innerHeight;
      return Math.floor(
        sectionBox.height + sectionBox.top - window.innerHeight
      );
    } else {
      return Math.floor(sectionBox.top);
    }
  }

  function scrollTo(id) {
    var el = document.getElementById(id);
    rootEl.scrollBy({
      left: 0,
      top: el.getBoundingClientRect().top - headerHeight,
      behavior: "smooth",
    });

    currentSection = id;
    history.replaceState({ from: location.hash }, "", "/#" + id);

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
      // console.log(overflow, scrollDelay);
      if (overflow != 0) {
        var scrollOffset =
          direction === 1
            ? Math.min(overflow, ev.deltaY)
            : Math.max(overflow, ev.deltaY);
        rootEl.scrollBy(0, scrollOffset);
        if (scrollOffset === overflow) {
          setTimeout(function () {
            scrollDelay = false;
          }, 5e2);
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
    var startY, currentY, toId;

    function onTouchEnd(ev) {
      document.removeEventListener("touchmove", onTouchEnd);
      currentY = ev.changedTouches[0].screenY;
      if (Math.abs(startY - currentY) < 20) return;
      if (startY > currentY) {
        toId = sections[sections.indexOf(currentSection) + 1];
      } else {
        toId = sections[sections.indexOf(currentSection) - 1];
      }

      if (toId) {
        scrollTo(toId);
      }

      startY = void 0;
      currentY = void 0;
    }

    return function (ev) {
      startY = ev.changedTouches[0].screenY;
      document.addEventListener("touchend", onTouchEnd);
    };
  })();

  document.addEventListener("wheel", onScroll);
  document.addEventListener("touchstart", onSwipe);

  function onPopState() {
    currentSection = location.hash.replace(/#/, "");
  }

  window.addEventListener("popstate", onPopState);
});
