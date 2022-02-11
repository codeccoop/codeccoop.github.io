document.addEventListener("DOMContentLoaded", function () {
  var rootEl = document.getElementsByTagName("main")[0];
  var sectionScroller = new SectionScroller(rootEl, "home__section", {
    debug: false,
  });
  sectionScroller.onSectionUpdate = function (sectionId) {
    document.getElementById("pageHeader").setActiveLink(sectionId);
  };

  setTimeout(function () {
    var homeBg = new BackgroundPatterns("home");
    homeBg.bind(document.getElementById("home"));
    var workBg = new BackgroundPatterns("work");
    workBg.bind(document.getElementById("work"));
    var teamBg = new BackgroundPatterns("team");
    teamBg.bind(document.getElementById("team"));
  }, 0);
});
