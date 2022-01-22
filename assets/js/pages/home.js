(function () {
  var sections = Array.apply(
    null,
    document.getElementsByClassName("home__section")
  ).map((el) => el.id);

  var currentSectionEl = getCurrentSection();
  var currentSection = currentSectionEl.id;
  var sectionBox = currentSectionEl.getBoundingClientRect();
  setTimeout(function () {
    window.scrollBy(0, sectionBox.top);
  }, 100);

  var onScroll = (function () {
    var delayer, event;

    function callback() {
      var toId;
      if (event.deltaY > 0) {
        toId = sections[sections.indexOf(currentSection) + 1];
      } else {
        toId = sections[sections.indexOf(currentSection) - 1];
      }
      console.log(toId);
      if (toId) {
        var el = document.getElementById(toId);
        document.querySelector("main.home").scrollBy({
          left: 0,
          top: el.getBoundingClientRect().top,
          behavior: "smooth",
        });
        currentSection = toId;
      }
    }

    return function (ev) {
      event = ev;
      clearTimeout(delayer);
      delayer = setTimeout(callback, 50);
    };
  })();

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

  function onPopState() {
    currentSection = location.hash.replace(/#/, "");
  }

  document.addEventListener("wheel", onScroll);
  window.addEventListener("popstate", onPopState);
})();
