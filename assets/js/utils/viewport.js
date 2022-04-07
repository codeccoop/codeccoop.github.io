function setViewport() {
  var vh = window.innerHeight * 0.01;
  var vw = window.innerWidth * 0.01;
  var icbh = document.documentElement.clientHeight * 0.01;
  var icbw = document.documentElement.clientWidth * 0.01;

  document.documentElement.style.setProperty("--vh", `${vh}px`);
  document.documentElement.style.setProperty("--vw", `${vw}px`);
  document.documentElement.style.setProperty("--icbh", `${icbh}px`);
  document.documentElement.style.setProperty("--icbw", `${icbw}px`);
}

window.addEventListener("resize", setViewport);
setTimeout(setViewport, 0);
