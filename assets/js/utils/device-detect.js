function isMobile() {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform)
  );
}

function isSafari() {
  return (
    /Safari/i.test(
      navigator.userAgent
    ) &&
    navigator.userAgent.match(/version\/[0-9]+/i) != null &&
    navigator.userAgent.match(/version\/([0-9]+)/i)[1] <= 12
  );
}

function isTouchEnabled() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}
