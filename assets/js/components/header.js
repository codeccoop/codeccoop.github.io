document.addEventListener("DOMContentLoaded", function () {
  var burger = document.querySelectorAll(".navbar-burger")[0];
  burger.addEventListener("click", function () {
    var targetId = burger.dataset.target;
    var targetEl = document.getElementById(targetId);

    burger.classList.toggle("is-active");
    targetEl.classList.toggle("is-active");
  });

  function setActiveLink(id) {
    var items = Array.apply(null, this.getElementsByClassName("navbar-item"));
    var item = items.filter(function (item) {
      if (item.classList.contains("has-dropdown")) {
        item.children[0].classList.remove("is-active");
      } else {
        item.classList.remove("is-active");
      }
      return item.dataset.id == id;
    })[0];
    if (item.classList.contains("has-dropdown")) {
      item.children[0].classList.add("is-active");
    } else {
      item.classList.add("is-active");
    }
  }

  var header = document.getElementsByTagName("header")[0];
  header.setActiveLink = setActiveLink.bind(header);

  var currentPage;
  var match = location.pathname.match(/\/(.*)(?=\.html)/);
  if (match) {
    var isPost = location.pathname.match(
      /\/[0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}\//
    );
    if (isPost) currentPage = "blog";
    else currentPage = match[1];
  } else if (location.hash !== "") {
    currentPage = location.hash.replace(/\#/, "");
  } else {
    if (location.pathname.match(/^\/blog\//)) currentPage = "blog";
    else currentPage = "home";
  }

  header.setActiveLink(currentPage);
});
