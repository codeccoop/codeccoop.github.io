var SectionScroller = (function () {
  /* PRIVATE INTERFACE */
  function _smoothScrolling($el, order) {
    var delta = 0;
    var offset = Math.abs(order.top);
    var direction = order.top > 0 ? 1 : -1;

    return Easeer.debounce(
      function (progress) {
        var move = offset * progress * direction - delta;
        $el.scrollBy(0, move);
        delta += move;
      },
      7,
      (offset / 20) * 7,
      "out"
    );
  }

  function _setupScrollViewport(getContentHeight) {
    var viewport = document.createElement("div");
    viewport.classList.add("scroll-viewport");
    var span = document.createElement("div");
    span.classList.add("scroll-span");

    var height = getContentHeight();
    window.addEventListener("resize", function () {
      height = getContentHeight();
      span.style.height = height + "px";
    });

    span.style.height = height + "px";
    viewport.appendChild(span);
    return viewport;
  }

  function _onScrollEnds($el, fn) {
    var scrolled = false;
    var delayed;

    function then() {
      $el.removeEventListener("scroll", whileScroll);
      if (scrolled) fn();
    }

    function whileScroll() {
      clearTimeout(delayed);
      delayed = setTimeout(then, 150);
      scrolled = true;
    }

    $el.addEventListener("scroll", whileScroll);
    delayed = setTimeout(then, 150);
  }

  function _swipeMotion(speed) {
    if (Math.abs(speed) < 0.5) return;

    var self = this;
    var speedFactor = 10;
    speed = speed * speedFactor;
    var steps = Math.min(100, Math.abs(speed) / 0.1);

    var stop = Easeer.animate(
      function (progress) {
        var delta = speed - speed * progress;
        var direction = delta > 0 ? 1 : -1;
        var overflow = self.getCurrentSectionOverflow(direction);
        var offset = Math.min(Math.abs(delta), Math.abs(overflow)) * direction;
        self.$el.scrollBy(0, offset);
        self.$viewport.scrollBy(0, offset);

        if (offset === overflow) {
          stop();
        }
      },
      steps,
      "out"
    );

    function onTouchStart() {
      stop();
      document.removeEventListener("touchstart", onTouchStart);
    }

    document.addEventListener("touchstart", onTouchStart);
  }

  /* PUBLIC INTERFACE */
  function SectionScroller(scrollEl, sectionClass) {
    var self = this;
    this.$el = scrollEl;
    sectionClass ||= "scroll-section";
    this.sectionClass = sectionClass;
    this.delayed = false;

    this.$el.style.height = "100vh";
    this.$el.style.overflowY = "hidden";

    for (var i = 0; i < this.$el.childElementCount; i++) {
      this.$el.children[i].style.minHeight = "100vh";
    }

    Object.defineProperty(this, "sections", {
      configurable: false,
      enumerable: true,
      writable: false,
      value: Array.apply(
        null,
        document.getElementsByClassName(sectionClass)
      ).map(function (el, i) {
        if (el.getAttribute("id") === null) {
          el.setAttribute("id", "scroll-section-" + i);
        }
        return el.id;
      }),
    });

    var _currentSection;
    Object.defineProperty(this, "currentSection", {
      get: function () {
        return _currentSection;
      },
      set: function (section) {
        if (Number.isInteger(section)) {
          section = self.sections[section];
        }

        if (section !== _currentSection && section) {
          _currentSection = section;
          self.scrollTo(_currentSection);

          setTimeout(function () {
            self.onSectionUpdate(_currentSection);
          }, 0);
        }
      },
    });

    this.onScroll = this.onScroll.bind(this);
    document.addEventListener("wheel", this.onScroll, true);
    this.onSwipe = this.onSwipe.bind(this);
    document.addEventListener("touchstart", this.onSwipe, true);

    function onPopState() {
      _currentSection = location.hash.replace(/#/, "");
      var section = document.getElementById(_currentSection);
      var box = section.getBoundingClientRect();
      self.$viewport.scrollBy(0, box.top);
      self.onSectionUpdate(_currentSection);
    }

    window.addEventListener("popstate", onPopState);

    setTimeout(function () {
      self.$viewport = _setupScrollViewport(self.getContentHeight.bind(self));
      self.$el.appendChild(self.$viewport);

      var hashId = location.hash.replace(/#/, "");
      var visibleSection =
        document.getElementById(hashId) || self.getVisibleSection();
      _currentSection = visibleSection.id;
      location.hash = _currentSection;

      self.scrollTo(_currentSection, "auto");
      self.delayed = false;
    }, 0);
  }

  SectionScroller.prototype.getContentHeight = function () {
    var height = 0;
    for (var i = 0; i < this.$el.childElementCount; i++) {
      if (this.$el.children[i].classList.contains("scroll-viewport")) {
        continue;
      }

      height += this.$el.children[i].clientHeight;
    }

    return height;
  };

  SectionScroller.prototype.getVisibleSection = function () {
    return Array.apply(
      null,
      document.getElementsByClassName(this.sectionClass)
    ).reduce(function (focused, sectionEl) {
      var acum_top = focused
        ? focused.getBoundingClientRect().top
        : window.innerHeight;
      var n_top = sectionEl.getBoundingClientRect().top;

      if (Math.abs(n_top) < Math.abs(acum_top)) {
        return sectionEl;
      } else {
        return focused;
      }
    }, null);
  };

  SectionScroller.prototype.getCurrentSectionOverflow = function (direction) {
    var overflow;
    var childEl = document.getElementById(this.currentSection);
    var box = childEl.getBoundingClientRect();
    if (direction > 0) {
      overflow = Math.floor(box.height + box.top - window.innerHeight);
    } else {
      overflow = Math.floor(box.top);
    }

    return Math.abs(overflow) <= 5 ? 0 : overflow;
  };

  SectionScroller.prototype.scrollTo = function (id, behavior) {
    behavior ||= "smooth";
    var el = document.getElementById(id);
    var order = {
      left: 0,
      top: el.getBoundingClientRect().top,
      behavior: behavior,
    };

    this.$el.scrollBy(order);

    if (behavior === "auto") {
      this.$viewport.scrollBy(order);
    } else {
      _smoothScrolling(this.$viewport, order);
    }

    this.currentSection = id;
    history.replaceState({ from: location.hash }, null, "/#" + id);

    _onScrollEnds(
      this.$el,
      (function (self) {
        return function () {
          self.delayed = false;
        };
      })(this)
    );

    this.delayed = true;
  };

  SectionScroller.prototype.onScroll = (function () {
    var delaye, startEvent, direction, overflow;

    return function (ev) {
      ev.stopPropagation();
      self = this;
      if (self.delayed === true) return;
      direction = ev.deltaY < 0 ? -1 : 1;
      overflow = self.getCurrentSectionOverflow(direction);
      if (overflow === 0) {
        // Case when scrolled to the end of a section
        startEvent = ev;
        clearTimeout(delaye);
        delaye = setTimeout(function () {
          self.currentSection =
            self.sections.indexOf(self.currentSection) + direction;
        }, 50);
      } else {
        // Scroll through the content of one section
        var offset =
          Math.min(Math.abs(overflow), Math.abs(ev.deltaY)) * direction;
        self.$el.scrollBy(0, offset);
        self.$viewport.scrollBy(0, offset);

        if (offset === overflow) {
          _onScrollEnds(self.$el, function () {
            self.delayed = false;
          });
          self.delayed = true;
        }
      }
    };
  })();

  SectionScroller.prototype.onSwipe = (function () {
    var swipped = false;
    var startY, deltaY, direction, overflow, speed, lastTrack;

    function _onTouchMove(ev) {
      var self = this;
      var currentY = ev.changedTouches[0].screenY;
      var now = Date.now();
      deltaY = startY - currentY;
      direction = currentY > startY ? -1 : 1;
      speed = deltaY / (now - lastTrack);

      overflow = self.getCurrentSectionOverflow(direction);

      if (overflow === 0) {
        // pass
      } else {
        var offset = Math.min(Math.abs(overflow), Math.abs(deltaY)) * direction;
        self.$el.scrollBy(0, offset);
        self.$viewport.scrollBy(0, offset);

        if (offset === overflow) {
          self.delayed = true;
        } else {
          self.delayed = false;
        }

        startY = currentY;
        lastTrack = now;
      }

      swipped = true;
    }

    function _onTouchEnd(ev) {
      var self = this;
      document.removeEventListener("touchmove", _onTouchMove);
      document.removeEventListener("touchend", _onTouchEnd);
      if (!swipped) return;
      if (self.delayed) {
        self.delayed = false;
        return;
      }

      overflow = self.getCurrentSectionOverflow(direction);
      if (overflow === 0) {
        self.currentSection =
          self.sections.indexOf(self.currentSection) + direction;
      } else {
        _swipeMotion.call(self, speed);
      }

      startY = void 0;
      deltaY = void 0;
      direction = void 0;
      swipped = false;
    }

    return function (ev) {
      startY = ev.changedTouches[0].screenY;

      _onTouchMove = _onTouchMove.bind(this);
      document.addEventListener("touchmove", _onTouchMove);
      _onTouchEnd = _onTouchEnd.bind(this);
      document.addEventListener("touchend", _onTouchEnd);
    };
  })();

  SectionScroller.prototype.onSectionUpdate = function () {};

  return SectionScroller;
})();
