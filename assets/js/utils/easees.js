var Easeer = (function () {
  function _scaleGen(range, domain) {
    if (!Array.isArray(range)) {
      range = [0, range];
    }
    if (!Array.isArray(domain)) {
      domain = [0, domain];
    }
    var rangeAmplitude =
      Math.max.apply(null, range) - Math.min.apply(null, range);
    var domainAmplitude =
      Math.max.apply(null, domain) - Math.min.apply(null, domain);

    return function (value) {
      return (
        ((value - Math.min.apply(null, range)) / rangeAmplitude) *
          domainAmplitude +
        Math.min.apply(null, domain)
      );
    };
  }

  function _ease(i) {
    return 3 * Math.pow(i, 2) - 2 * Math.pow(i, 3);
  }

  function* easeInOut(domain, steps) {
    steps = Math.round(steps || 100);
    var i = 0;
    var scale = _scaleGen([0, 1], domain);

    while (i <= 1) {
      yield _ease(i) * scale(i);
      i += 1 / steps;
    }
  }

  function* easeOut(domain, steps) {
    steps = Math.round(steps || 100);
    var i = 0;
    var scale = _scaleGen([0, 1], domain);

    while (i <= 1) {
      yield (2 * _ease((i + 1) / 2) - 1) * scale(i);
      i += 1 / steps;
    }
  }

  function* easeIn(domain, steps) {
    steps = Math.round(steps || 100);
    var i = 0;
    var scale = _scaleGen([0, 1], domain);

    while (i <= 1) {
      yield _ease(i / 2) * 2 * scale(i);
      i += 1 / steps;
    }
  }

  function _easeSwitcher(ease, domain, steps) {
    switch (ease) {
      case "in":
        return easeIn(domain, steps);
        break;
      case "out":
        return easeOut(domain, steps);
        break;
      default:
        return easeInOut(domain, steps);
        break;
    }
  }

  function debounce(fn, debounce, duration, ease) {
    debounce ||= 10;
    duration ||= 1000;
    var gen = _easeSwitcher(ease, [0, 1], duration / debounce);
    var next = gen.next();
    var closed = false;

    function _transition() {
      next = gen.next();
      fn(next.value);
      if (!(next.done || closed)) {
        setTimeout(_transition, debounce);
      }
    }
    _transition();

    return function () {
      closed = true;
    };
  }

  function animate(fn, steps, ease) {
    steps ||= 100;
    var gen = _easeSwitcher(ease, [0, 1], steps);
    var next = gen.next();
    var closed = false;

    function _wrapper() {
      fn(next.value);
      next = gen.next();
    }

    function _transition() {
      _wrapper();
      if (!(next.done || closed)) {
        requestAnimationFrame(_transition);
      }
    }
    _transition();

    return function () {
      closed = true;
    };
  }

  return {
    easeInOut: easeInOut,
    easeIn: easeIn,
    easeOut: easeOut,
    debounce: debounce,
    animate: animate,
  };
})();
