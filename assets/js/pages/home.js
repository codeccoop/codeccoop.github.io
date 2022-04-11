document.addEventListener("DOMContentLoaded", function () {
  var $el = document.getElementsByTagName("main")[0];

  var sectionScroller = new SectionSnapScroller($el, {
    sectionClass: "home__section",
    debug: false,
    behavior: "mandatory",
    onSectionUpdate: function (sectionId) {
      document.getElementById("pageHeader").setActiveLink(sectionId);
    },
  });

  var scrollChevron = $el.getElementsByClassName("home__landing-chevron")[0];
  scrollChevron.addEventListener("click", function () {
    if (!isMobile()) {
      sectionScroller.scrollTo("work", 1, "smooth");
    } else {
      location.hash = "work";
    }
  });

  var frames = [
    ['<h1 class="title is-1"><span class="cursor"></span></h1>', 0],
    ['<h1 class="title is-1"></h1>', 600],
    ['<h1 class="title is-1"><span class="cursor"></span></h1>', 600],
    ['<h1 class="title is-1">C<span class="cursor"></span></h1>', 300],
    ['<h1 class="title is-1">Cò<span class="cursor"></span></h1>', 200],
    ['<h1 class="title is-1">Còd<span class="cursor"></span></h1>', 200],
    ['<h1 class="title is-1">Còde<span class="cursor"></span></h1>', 200],
    ['<h1 class="title is-1">Còdec<span class="cursor"></span></h1>', 200],
    ['<h1 class="title is-1">Còdec</h1>', 300],
    ['<h1 class="title is-1">Còdec<span class="cursor highlight"></span></h1>', 600],
    [
      '<h1 class="title is-1">Còde<span class="cursor highlight"></span><span class="bytes">11</span></h1>',
      300,
    ],
    [
      '<h1 class="title is-1">Còd<span class="cursor highlight"></span><span class="bytes">0111</span></h1>',
      200,
    ],
    [
      '<h1 class="title is-1">Cò<span class="cursor highlight"></span><span class="bytes">100111</span></h1>',
      200,
    ],
    [
      '<h1 class="title is-1">C<span class="cursor highlight"></span><span class="bytes">10100111</span></h1>',
      200,
    ],
    [
      '<h1 class="title is-1"><span class="cursor highlight"></span><span class="bytes">1100100111</span></h1>',
      200,
    ],
    ['<h1 class="title is-1"><span class="bytes">1100100111</span></h1>', 300],
    [
      '<h1 class="title is-1"><span class="cursor"></span><span class="bytes">1100100111</span></h1>',
      600,
    ],
    [
      '<h1 class="title is-1">C<span class="cursor"></span><span class="bytes">00100111</span></h1>',
      300,
    ],
    [
      '<h1 class="title is-1">Cò<span class="cursor"></span><span class="bytes">100111</span></h1>',
      200,
    ],
    [
      '<h1 class="title is-1">Còd<span class="cursor"></span><span class="bytes">0111</span></h1>',
      200,
    ],
    [
      '<h1 class="title is-1">Còde<span class="cursor"></span><span class="bytes">11</span></h1>',
      200,
    ],
    ['<h1 class="title is-1">Còdec<span class="cursor"></span></h1>', 200],
    ['<h1 class="title is-1">Còdec</h1>', 200],
    ['<h1 class="title is-1">Còdec<span class="cursor"></span></h1>', 600],
    ['<h1 class="title is-1">Còde<span class="cursor"></span>c</h1>', 300],
    ['<h1 class="title is-1">Còd<span class="cursor"></span>ec</h1>', 200],
    ['<h1 class="title is-1">Cò<span class="cursor"></span>dec</h1>', 200],
    ['<h1 class="title is-1">Còdec</h1>', 200],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span></span>dec</h1>',
      600,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1>',
      300,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4"><span class="cursor"></span></h2>',
      600,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">C<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Co<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Cod<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codi<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis <span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis c<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis co<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis com<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comu<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comun<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns p<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns pe<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per <span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per u<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per un<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una <span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una t<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una te<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tec<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecn<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecno<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnol<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnolo<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnolog<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnologi<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnologia<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnologia <span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnologia m<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnologia mé<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnologia més<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnologia més d<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnologia més de<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnologia més dem<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnologia més demo<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnologia més democ<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnologia més democr<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnologia més democrà<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnologia més democràt<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnologia més democràti<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnologia més democràtic<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnologia més democràtica<span class="cursor"></span></h2>',
      75,
    ],
    [
      '<h1 class="title is-1">Cò<span class="highlight"><span class="cursor"></span>o</span>dec</h1><h2 class="title is-4">Codis comuns per una tecnologia més democràtica</h2>',
      600,
    ],
  ];

  var landing = document.getElementById("home").getElementsByClassName("home__brand")[0];

  function frame(content, timeout) {
    if (!content) return;
    setTimeout(function () {
      landing.innerHTML = content;
      frame.apply(null, frames.shift());
    }, timeout);
  }

  frame(frames.shift());
});
