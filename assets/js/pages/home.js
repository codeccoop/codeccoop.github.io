document.addEventListener("DOMContentLoaded", function () {
  var rootEl = document.getElementsByTagName("main")[0];
  var sectionScroller = new SectionScroller(rootEl, "home__section", {
    debug: false,
  });
  sectionScroller.onSectionUpdate = function (sectionId) {
    document.getElementById("pageHeader").setActiveLink(sectionId);
  };
});
