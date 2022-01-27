document.addEventListener("DOMContentLoaded", function () {
  var parser = document.createElement("template");
  var posts;
  fetch("/blog/posts.html").then(function (res) {
    res.text().then((html) => {
      parser.innerHTML = html;

      posts = Array.apply(
        null,
        parser.content.firstElementChild.getElementsByClassName("blog__entry")
      );
    });
  });
  var postsWrapper = document.getElementsByClassName("blog__posts")[0];
  var pagePosts = Array.apply(
    null,
    postsWrapper.getElementsByClassName("blog__entry")
  );

  var currentCategory = "all";
  var categoriesWrapper =
    document.getElementsByClassName("blog__categories")[0];
  if (categoriesWrapper) {
    var categoryNodes = document.getElementsByClassName("blog__category");
    for (var i = 0; i < categoryNodes.length; i++) {
      var btn = categoryNodes[i];
      btn.addEventListener("click", onFilter);
    }

    var resetCategoriesBtn =
      categoriesWrapper.getElementsByTagName("button")[0];
    resetCategoriesBtn.addEventListener("click", onResetCategories);
  }

  function onFilter(ev) {
    var node = ev.target;
    var category = node.dataset.category;
    if (category === "all") {
      postsWrapper.innerText = "";
      for (var i = 0; i < pagePosts.length; i++) {
        postsWrapper.appendChild(pagePosts[i]);
      }
    } else {
      var catPosts = posts.filter(function (el) {
        return category === el.dataset.category || category === "all";
      });
      postsWrapper.innerText = "";
      for (var i = 0; i < catPosts.length; i++) {
        postsWrapper.appendChild(catPosts[i]);
      }
    }
    currentCategory = category;

    for (var i = 0; i < categoryNodes.length; i++) {
      categoryNodes[i].classList.remove("is-selected");
    }

    if (currentCategory === "all") {
      categoriesWrapper.classList.remove("is-active");
      document.getElementById("blogPagination").classList.remove("hidden");
    } else {
      categoriesWrapper.classList.add("is-active");
      node.classList.add("is-selected");
      document.getElementById("blogPagination").classList.add("hidden");
    }
  }

  function onResetCategories(ev) {
    postsWrapper.innerText = "";
    for (var i = 0; i < pagePosts.length; i++) {
      postsWrapper.appendChild(pagePosts[i]);
    }
    currentCategory = "all";

    categoriesWrapper.classList.remove("is-active");
    for (var i = 0; i < categoryNodes.length; i++) {
      categoryNodes[i].classList.remove("is-selected");
    }
    document.getElementById("blogPagination").classList.remove("hidden");
  }
});
