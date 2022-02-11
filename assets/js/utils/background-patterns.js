var BackgroundPatterns = (function () {
  function b64url(svgText) {
    var prefix = "data:image/svg+xml;base64,";
    return prefix + btoa(unescape(encodeURIComponent(svgText)));
  }

  function min(formula) {
    return Math.min.apply(
      null,
      formula
        .replace(/px/gi, "")
        .replace(/^min\(/i, "")
        .replace(/\)$/, "")
        .split(",")
    );
  }

  function max(formula) {
    return Math.max.apply(
      null,
      formula
        .replace(/px/gi, "")
        .replace(/^max\(/i, "")
        .replace(/\)$/, "")
        .split(",")
    );
  }

  function calc(formula) {
    return eval(formula.replace(/px/gi, ""));
  }

  function render(template, viewport) {
    var token = template.match(/calc\(((.(?!\)))+.)\)/i);
    while (token) {
      template = template.replace(
        /calc\((.(?!\)))+.\)/i,
        calc(render(token[1], viewport))
      );
      token = template.match(/calc\(((.(?!\)))+.)\)/i);
    }

    token = template.match(/min\( *((.(?!\)))+.)\)/i);
    while (token) {
      template = template.replace(
        /min\( *(.(?!\)))+.\)/i,
        min(render(token[1], viewport))
      );
      token = template.match(/min\( *((.(?!\)))+.)\)/i);
    }

    token = template.match(/max\( *((.(?!\)))+.)\)/i);
    while (token) {
      template = template.replace(
        /max\( *(.(?!\)))+.\)/i,
        max(render(token[1], viewport))
      );
      token = template.match(/max\( *((.(?!\)))+.)\)/i);
    }

    token = template.match(/\{ *(([0-9](?!vw))*[0-9])vw *\}/i);
    while (token) {
      template = template.replace(
        /\{ *([0-9](?!vw))*[0-9]vw *\}/i,
        token[1] * viewport.width * 0.01
      );
      token = template.match(/\{ *(([0-9](?!vw))*[0-9])vw *\}/i);
    }

    token = template.match(/\{ *(([0-9](?!vh))*[0-9])vh *\}/i);
    while (token) {
      template = template.replace(
        /\{ *([0-9](?!vh))*[0-9]vh *\}/i,
        token[1] * viewport.height * 0.01
      );
      token = template.match(/\{ *(([0-9](?!vh))*[0-9])vh *\}/i);
    }

    return template;
  }

  var debounce = (function () {
    var now, last, debounced;

    return function (callback, debounce) {
      function _callback(callback) {
        now = void 0;
        last = void 0;
        debounced = void 0;
        callback();
      }

      return function (ev) {
        debounce ||= 50;
        clearTimeout(debounced);
        now = Date.now();
        if (last === void 0) {
          callback();
          last = now;
        } else if (now - last > debounce) {
          callback();
        } else {
          setTimeout(callback, now - last);
        }
      };
    };
  })();

  function BackgroundPatterns(page) {
    this.page = page;

    var self = this;
    Object.defineProperty(this, "viewport", {
      get: function () {
        if (self.node) {
          return {
            width: this.node.offsetWidth,
            height: this.node.offsetHeight,
          };
        } else {
          return { width: window.innerWidth, height: window.innerHeight };
        }
      },
    });

    Object.defineProperty(this, "templates", {
      get: function () {
        return {
          home:
            '<svg width="{100vw}" height="{100vh}" xmlns="http://www.w3.org/2000/svg">' +
            (window.innerWidth > 700
              ? '<path d="M {2vw}, 300 V {100vh} H {9vw} V 90 Z" fill="#40a1df" />'
              : '<path d="M 0, 300 V {100vh} H {9vw} V 90 Z" fill="#40a1df" />') +
            (window.innerWidth > 700
              ? '<path d="M {2vw}, 300 H {82vw} V 90 H {9vw} Z" fill="#8edf00" />'
              : '<path d="M 0, 200 V 300 H {82vw} V 90 H {9vw} Z" fill="#8edf00" />') +
            '<path d="M {82vw}, 300 V 0 H {92vw} V 90 Z" fill="#df0094"/>' +
            "</svg>",
          work:
            '<svg width="{100vw}" height="{100vh}" xmlns="http://www.w3.org/2000/svg">' +
            (window.innerWidth > 700
              ? '<path d="M {2vw}, 0 V {45vh} H max(50px, {9vw}) V 0 Z" fill="#40a1df" />'
              : '<path d="M 0, 0 V {45vh} H {9vw} V 0 Z" fill="#40a1df" />') +
            '<path d="M {98vw}, {100vh} V {55vh} H min({91vw}, calc({98vw} - 50px)) V {100vh} Z" fill="#8edf00" />' +
            "</svg>",
          team:
            '<svg width="{100vw}" height="{100vh}" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M {98vw}, {90vh} V 0 H min({91vw}, calc({98vw} - 50px)) V {98vh} Z" fill="#8edf00" />' +
            '<path d="M {98vw}, {90vh} H max({9vw}, 50px) V {98vh} H {92vw} Z" fill="#40a1df" />' +
            '<path d="M max(50px, {9vw}), {90vh} V {100vh} H {2vw} V {98vh} Z" fill="#df0094"/>' +
            "</svg>",
          default:
            '<svg width="{100vw}" height="{100vh}" xmlns="http://www.w3.org/2000/svg">' +
            "</svg>",
        };
      },
    });
  }

  BackgroundPatterns.prototype.bind = function (node) {
    this.node = node;
    node.style.backgroundImage =
      "url(" + b64url(render(this.templates[this.page], this.viewport)) + ")";
    node.style.backgroundPositionX = "0px";
    node.style.backgroundPositionY = "0px";
    // node.style.backgroundPosition = "center";
    node.style.backgroundSize = "cover";
    node.style.backgroundRepeat = "no-repeat";

    var self = this;
    window.addEventListener(
      "resize",
      debounce(function () {
        node.style.backgroundImage =
          "url(" +
          b64url(render(self.templates[self.page], self.viewport)) +
          ")";
      }, 50)
    );
  };

  return BackgroundPatterns;
})();
