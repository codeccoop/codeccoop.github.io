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

    var delta = 0;
    function scrollTransition() {
      var offset = Math.abs(scrollOrder.top);
      var direction = scrollOrder.top > 0 ? 1 : -1;
      var easeer = easeInOut(offset, offset / 20);
      var next = easeer.next();

      function transition() {
        scrollViewport.scrollBy(0, next.value * direction - delta);
        delta = next.value * direction;
        next = easeer.next();
        if (next.done === false) {
          setTimeout(transition, 7);
        }
      }

      transition();
    }

    /* function scrollTransition() {
      var _offset = Math.abs(scrollOrder.top);
      var _direction = scrollOrder.top > 0 ? 1 : -1;
      easeer = easeInOut(_offset, _offset / 20);

      var next = easeer.next();
      while (next.done === false) {
        next = easeer.next();
        scrollViewport.scrollBy(0, next.value - offset);
      }
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
        setTimeout(scrollTransition, 8);
      }
    } */

    scrollTransition();

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
    var startY, deltaY, direction, lastTrack, now, speed;

    function swipeMotion(speed) {
      function swipe() {}
      while (speed < 0) {
        rootEl.scrollBy();
      }
    }

    function onTouchMove(ev) {
      var currentY = ev.changedTouches[0].screenY;
      now = Date.now();
      deltaY = startY - currentY;
      direction = currentY > startY ? -1 : 1;
      speed = deltaY / (now - lastTrack);
      var sectionOverflow = getCurrentSectionOverflow(direction);

      if (sectionOverflow != 0) {
        var scrollOffset =
          direction === 1
            ? Math.min(sectionOverflow, deltaY)
            : Math.max(sectionOverflow, deltaY);
        rootEl.scrollBy(0, scrollOffset);
        scrollViewport.scrollBy(0, scrollOffset);
        if (scrollOffset === sectionOverflow) {
          scrollDelay = true;
        } else {
          scrollDelay = false;
        }
        startY = currentY;
        lastTrack = now;
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
      } else {
        var speedFactor = 10;
        var steps = Math.min(100, Math.abs(speed * speedFactor) / 0.05);
        var easeer = easeOut(speed * direction * speedFactor, steps);
        var next = easeer.next();

        var stopped = false;
        function motion() {
          var delta = speed * speedFactor - next.value;
          var direction = delta > 0 ? 1 : -1;
          var sectionOverflow = getCurrentSectionOverflow(direction);
          var scrollOffset =
            direction === -1
              ? Math.max(delta, sectionOverflow)
              : Math.min(delta, sectionOverflow);
          rootEl.scrollBy(0, scrollOffset);
          scrollViewport.scrollBy(0, scrollOffset);
          next = easeer.next();
          if (
            next.done === false &&
            stopped === false &&
            scrollOffset !== sectionOverflow
          ) {
            requestAnimationFrame(motion);
          }
        }

        function onTouchStart() {
          stopped = true;
          document.removeEventListener("touchstart", onTouchStart);
        }
        document.addEventListener("touchstart", onTouchStart);

        if (Math.abs(speed) > 0.5) motion();
      }

      startY = void 0;
      deltaY = void 0;
      direction = void 0;
      swipped = false;
    }

    return function (ev) {
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
