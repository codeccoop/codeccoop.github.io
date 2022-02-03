function scaleGen(range, domain) {
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

function* easeInOut(domain, steps) {
  steps = Math.round(steps || 100);
  var i = 0;
  var scale = scaleGen([0, 1], domain);
  while (i <= 1) {
    yield (3 * Math.pow(i, 2) - 2 * Math.pow(i, 3)) * scale(i);
    i += 1 / steps;
  }
}

function* easeOut(domain, steps) {
  steps = Math.round(steps || 100);
  var i = 0;
  var scale = scaleGen([0, 1], domain);

  while (i <= 1) {
    yield (2 * (3 * Math.pow((i + 1) / 2, 2) - 2 * Math.pow((i + 1) / 2, 3)) -
      1) *
      scale(i);
    i += 1 / steps;
  }
}

function* easeIn(range, steps) {
  steps = Math.round(steps || 100);
  var i = 0;
  var scale = scaleGen(range, [0, 1]);
  while (i <= 1) {
    yield (3 * Math.pow(i / 2, 2) - 2 * Math.pow(i / 2, 3)) * 2 * scale(i);
    i += 1 / steps;
  }
}
