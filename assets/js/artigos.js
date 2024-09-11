const isMobileOrTablet = window.matchMedia("(max-width: 991px)").matches;

function hexToRGB(hex) {
  hex = hex.replace(/^#/, "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b];
}

function addWillChange(elements, properties) {
  if (NodeList.prototype.isPrototypeOf(elements) || Array.isArray(elements)) {
    elements.forEach((element) => {
      element.style.willChange = properties;
    });
  } else if (elements instanceof HTMLElement) {
    elements.style.willChange = properties;
  }
}

function removeWillChange(elements) {
  if (NodeList.prototype.isPrototypeOf(elements) || Array.isArray(elements)) {
    elements.forEach((element) => {
      element.style.willChange = "";
    });
  } else if (elements instanceof HTMLElement) {
    elements.style.willChange = "";
  }
}

function isInViewport(element, tolerance = 0.1) {
  const rect = element.getBoundingClientRect();

  const elementHeight = rect.height;
  const elementWidth = rect.width;

  const elementArea = elementHeight * elementWidth;

  // Calcula a área visível
  const visibleWidth = Math.max(
    0,
    Math.min(
      rect.right,
      window.innerWidth || document.documentElement.clientWidth
    ) - Math.max(0, rect.left)
  );
  const visibleHeight = Math.max(
    0,
    Math.min(
      rect.bottom,
      window.innerHeight || document.documentElement.clientHeight
    ) - Math.max(0, rect.top)
  );

  const visibleArea = visibleWidth * visibleHeight;

  return visibleArea >= elementArea * tolerance;
}

function initializeScrollTrigger(locoScroll) {
  gsap.registerPlugin(ScrollTrigger);

  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("#sccont", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.querySelector("#sccont").style.transform
      ? "transform"
      : "fixed",
  });

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();
}

class IntroAnimation {
  constructor() {
    this.introWrap = document.querySelector(".intro_wrap");
    this.language = document.querySelector(".menu_text_wrap");
    this.menu = document.querySelector(".menu_icon_wrap");
    this.artigoIntroTxt = document.querySelector(".artigo-intro-txt");

    this.artigos = Array.from(document.querySelectorAll(".artigo")).filter(
      (element) => isInViewport(element)
    );

    this.imgArtigos = Array.from(
      document.querySelectorAll(".img-artigo")
    ).filter((element) => isInViewport(element));

    this.dateElements = Array.from(document.querySelectorAll(".date")).filter(
      (element) => isInViewport(element)
    );

    this.darkOffsets = Array.from(
      document.querySelectorAll(".darckoffset")
    ).filter((element) => isInViewport(element));
  }
  setInitialStates() {
    gsap.set(this.language, { y: "100%" });
    gsap.set(this.menu, { opacity: 0 });
    gsap.set(this.introWrap, { opacity: 1 });

    this.artigos.forEach((artigo) => {
      gsap.set(artigo, { clipPath: "inset(100% 0 0 0)" });
    });

    this.imgArtigos.forEach((img) => {
      gsap.set(img, { scale: 1.15, opacity: 0 });
    });

    this.dateElements.forEach((date) => {
      gsap.set(date, { y: "50%", opacity: 0 });
    });

    gsap.set(this.artigoIntroTxt, { opacity: 0, y: "15%" });
    gsap.set(this.darkOffsets, { opacity: 1 });
  }

  animateIntro(remainingTime) {
    const timeline = gsap.timeline({
      defaults: {
        duration: 1,
        ease: "power2.out",
      },
    });

    const d = remainingTime / 1000 + 0.75;

    addWillChange(this.artigos, "clip-path, transform, opacity");
    addWillChange(this.imgArtigos, "transform, opacity");
    addWillChange(this.artigoIntroTxt, "opacity, transform");
    addWillChange(this.dateElements, "transform, opacity");
    addWillChange(this.darkOffsets, "opacity");

    timeline
      .to(
        this.introWrap,
        {
          opacity: 0,
          display: "none",
          ease: "power1.inOut",
          duration: 0.7,
          onComplete: () => {
            document.body.classList.remove("menu-open");
          },
        },
        remainingTime / 1000
      )
      .to(this.menu, { opacity: 1 }, d - 0.2)
      .to(this.language, { y: "0%" }, d);

    this.artigos.forEach((artigo) => {
      timeline.to(artigo, { clipPath: "inset(0% 0 0 0)" }, d - 0.1);
    });

    this.imgArtigos.forEach((img) => {
      timeline.to(img, { scale: 1, opacity: 1 }, d - 0.1);
    });

    timeline
      .to(
        this.artigoIntroTxt,
        { opacity: 1, duration: 1, ease: "power3.inOut" },
        d - 0.1
      )
      .to(this.artigoIntroTxt, { y: "0%", ease: "power3.out" }, d);

    this.darkOffsets.forEach((darkOffset) => {
      timeline.to(
        darkOffset,
        { opacity: 0, duration: 0.9, ease: "power3.out" },
        d - 0.1
      );
    });

    this.dateElements.forEach((date) => {
      timeline.to(date, { y: "0%", opacity: 1 }, d + 0.3);
    });

    // Remove will-change ao finalizar a animação
    timeline.eventCallback("onComplete", () => {
      // removeWillChange(this.artigos);
      // removeWillChange(this.imgArtigos);
      // removeWillChange(this.artigoIntroTxt);
      removeWillChange(this.dateElements);
      removeWillChange(this.darkOffsets);
    });

    return timeline;
  }

  handleFontLoadSuccess(start) {
    const end = performance.now();
    const duration = end - start;
    const MIN_SHOW_TIME = 1500;
    const remainingTime = Math.max(MIN_SHOW_TIME - duration, 0);

    this.setInitialStates();
    this.animateIntro(remainingTime);

    console.log(`Fonte Gotham Ultra carregada em ${duration}ms`);
  }

  handleFontLoadFailure(start) {
    console.error("Conexão fraca");
    setTimeout(() => {
      this.handleFontLoadSuccess(start);
    }, 5000);
  }
}

function setupArtigoWrapHover() {
  if (!window.matchMedia("(min-width: 992px)").matches) return;

  const artigos = document.querySelectorAll(".relative");

  artigos.forEach((artigo) => {
    const darkOffset = artigo.querySelector(".darckoffset");
    const titulo = artigo.querySelector(".titulo");
    const autores = artigo.querySelector(".autores");
    const arrowBtn = artigo.querySelector(".arrow-btn");

    // Define initial state
    gsap.set([darkOffset, titulo, autores, arrowBtn], { opacity: 0 });
    gsap.set(titulo, { y: "5%" });

    artigo.addEventListener("mouseenter", () => {
      // Aplica will-change utilizando a função utilitária
      addWillChange([darkOffset, titulo, autores, arrowBtn], "opacity");
      addWillChange(titulo, "transform");

      const tl = gsap.timeline({
        defaults: { duration: 0.5, ease: "power2.out" },
      });

      tl.to(darkOffset, { opacity: 1 }, "<")
        .to(titulo, { y: "0%", opacity: 1 }, "<")
        .to([autores, arrowBtn], { opacity: 1 }, 0.05);
    });

    artigo.addEventListener("mouseleave", () => {
      const tl = gsap.timeline({
        defaults: { duration: 0.5, ease: "power1.out" },
      });

      tl.to([darkOffset, titulo, autores, arrowBtn], { opacity: 0 })
        .to(titulo, { y: "5%" }, 0)
        .eventCallback("onComplete", () => {
          removeWillChange([darkOffset, titulo, autores, arrowBtn]);
        });
    });
  });
}

function FadeinDate() {
  const dateElements = document.querySelectorAll(".date");

  dateElements.forEach((element) => {
    if (!isInViewport(element) && !element.classList.contains("animated")) {
      element.classList.add("fade-in");
      addWillChange(element, "transform, opacity");
    }

    const fadeIn = document.querySelectorAll(".fade-in");

    fadeIn.forEach((element) => {
      const offset = 0;
      const startPercentage = (offset - 100) * -1;

      gsap.set(element, {
        y: isMobileOrTablet ? "10%" : "50%",
        opacity: 0,
      });

      const scrollTrigger = {
        trigger: element,
        scroller: "#sccont",
        start: `top ${startPercentage}%`,
      };

      gsap.to(element, {
        y: "0%",
        duration: 0.5,
        ease: "power3.Out",
        scrollTrigger,
      });

      gsap.to(element, {
        opacity: 1,
        duration: 0.5,
        ease: "power1.inOut",
        scrollTrigger,
      });
    });
  });
}

class AnimationCanvas {
  constructor(el, options = {}) {
    this.el = el;

    this.color = hexToRGB("#fefefe");

    this.inverted = options.inverted || false;

    this.direction = options.direction || "up";
  }

  init() {
    if (window.matchMedia("(prefers-reduced-motion)").matches) return;

    this.checkResizeBind = this.checkResize.bind(this);
    window.addEventListener("resize", this.checkResizeBind);

    this.setup();

    this.drawBind = this.draw.bind(this);
    gsap.ticker.add(this.drawBind);
  }

  setup() {
    this.compute();
    this.populate();
    this.animate();
  }

  checkResize() {
    if (!this.resizeTick && window.innerWidth !== this.viewport?.width) {
      this.resizeTick = true;
      requestAnimationFrame(() => {
        this.setup();
        this.resizeTick = false;
      });
    }
  }

  compute() {
    this.ctx = this.el.getContext("2d");
    this.BCR = this.el.getBoundingClientRect();
    this.ctx.width = this.el.width = this.BCR.width;
    this.ctx.height = this.el.height = this.BCR.height;

    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.itemDimensions = {};
    this.ratio = 4 / 3;

    this.colsNb = 20;
    this.minItemWidth = 80;

    this.widthByNb = Math.ceil(this.ctx.width / this.colsNb);
    this.minWidth = Math.ceil(
      this.ctx.width / Math.floor(this.ctx.width / this.minItemWidth)
    );
    this.itemDimensions.width = Math.max(this.widthByNb, this.minWidth);
    this.rowsNb = Math.floor(
      this.ctx.height / (this.itemDimensions.width * (1 / this.ratio))
    );
    this.itemDimensions.height = Math.ceil(this.ctx.height / this.rowsNb);
  }

  populate() {
    this.items = [];

    for (let y = 0; y < this.rowsNb; y++) {
      const items = [];

      for (let x = 0; x < this.colsNb; x++) {
        const item = {
          x,
          y,
          opacity: 0.0,
          id: y * this.colsNb + x,
        };
        items.push(item);
      }

      this.items.push(items);
    }
  }

  animate() {
    this.tl?.kill?.();

    this.tl = gsap.timeline({});

    let count = 0;
    const duration = 1;
    const animateRow = (y) => {
      this.tl.to(
        gsap.utils.shuffle(this.items[y]),
        {
          opacity: 1,
          duration,
          stagger: duration / this.colsNb,
        },
        count * duration * 0.4
      );
      this.items[y] = this.items[y].sort((a, b) => a.id - b.id);
    };

    if (this.direction === "up") {
      for (let y = 0; y < this.rowsNb; y++) {
        animateRow(y);
        count++;
      }
    } else {
      for (let y = this.rowsNb - 1; y >= 0; y--) {
        animateRow(y);
        count++;
      }
    }

    this.tl.progress(0);
    this.tl.pause();
  }

  onScrollProgress(progress) {
    this.tl?.progress?.(this.inverted ? 1 - progress : progress);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
    this.ctx.textAlign = "center";

    for (let y = 0; y < this.rowsNb; y++) {
      for (let x = 0; x < this.colsNb; x++) {
        const item = this.items[y][x];
        this.ctx.fillStyle = `rgba(${this.color.join(",")},${item.opacity})`;
        this.ctx.fillRect(
          this.itemDimensions.width * x,
          this.itemDimensions.height * y,
          this.itemDimensions.width,
          this.itemDimensions.height
        );
      }
    }
  }

  destroy() {
    window.removeEventListener("resize", this.checkResizeBind);
    gsap.ticker.remove(this.drawBind);
  }
}

function setupCanvasScrollTrigger(
  canvasSelector,
  triggerSelector,
  options = {},
  start,
  end
) {
  const canvasElement = document.querySelector(canvasSelector);
  const animationModule = new AnimationCanvas(canvasElement, options);
  animationModule.init();

  ScrollTrigger.create({
    trigger: triggerSelector,
    scroller: "#sccont",
    start: start,
    end: end,
    scrub: true,
    onUpdate: (self) => {
      animationModule.onScrollProgress(self.progress);
    },
  });

  return animationModule;
}

function initializeCanvasAnimations() {
  let startFooter = isMobileOrTablet ? "top 110%" : "top 100%";
  let endFooter = isMobileOrTablet ? "bottom 110%" : "center 50%";

  setupCanvasScrollTrigger(
    ".animation-canvas-reverse",
    ".footersec",
    {
      inverted: true,
      direction: "up",
    },
    undefined,
    endFooter
  );
}

function setupHoverAnimation(selector, duration = 0, ease = "none") {
  const grey = getComputedStyle(document.documentElement)
    .getPropertyValue("--grey")
    .trim();
  const menuLinkHover = getComputedStyle(document.documentElement)
    .getPropertyValue("--menulinkhover")
    .trim();

  const elements = document.querySelectorAll(selector);

  elements.forEach((element) => {
    let hoverTimeline;

    element.addEventListener("mouseenter", () => {
      if (hoverTimeline) hoverTimeline.kill();
      gsap.to(element, {
        color: menuLinkHover,
        duration: 0,
      });
    });

    element.addEventListener("mouseleave", () => {
      hoverTimeline = gsap.to(element, {
        color: grey,
        duration: duration, // transição ao sair
        ease: ease,
      });
    });
  });
}

function initializeHoverAnimations() {
  setupHoverAnimation([".navlink", ".link"]);
  setupHoverAnimation(".menusocialiconwrap", 0.5, "ease");
}

function changeBurgerlineColorOnSection(
  entrySection,
  targetElement,
  colorIn,
  colorOut,
  prop = "backgroundColor"
) {
  ScrollTrigger.create({
    trigger: entrySection,
    scroller: "#sccont",
    start: "top 10%",
    end: "bottom 10%",
    onEnter: () => {
      gsap.to(targetElement, { [prop]: colorIn });
    },
    onLeave: () => {
      gsap.to(targetElement, { [prop]: colorOut });
    },
    onEnterBack: () => {
      gsap.to(targetElement, { [prop]: colorIn });
    },
    onLeaveBack: () => {
      gsap.to(targetElement, { [prop]: colorOut });
    },
  });
}

function setupMenuAnimation() {
  const menuIconWrap = document.querySelector(".menu_icon_wrap");
  const menuTextWrap = document.querySelector(".menu_text_wrap");
  const nav = document.querySelector(".nav");
  const close = document.querySelector(".close");
  const open = document.querySelector(".open");

  gsap.set(nav, { display: "none", opacity: 0 });
  gsap.set([menuTextWrap, close], { opacity: 1 });
  gsap.set(close, { opacity: 0 });

  let menuOpen = false;

  menuIconWrap.addEventListener("click", () => {
    const tl = gsap.timeline({
      defaults: {
        duration: 0.8,
        ease: "power2.Out",
      },
    });

    if (!menuOpen) {
      tl.set(nav, { display: "block", duration: 0 }, 0)
        .to(open, { opacity: 0, duration: 0.5 })
        .to(close, { opacity: 1, duration: 0.5 }, 0.2)
        .to(menuTextWrap, { opacity: 0, ease: "power3.out" }, 0)
        .to(nav, { opacity: 1 }, 0);
      document.body.classList.add("menu-open");
    } else {
      tl.to(close, { opacity: 0, duration: 0.5 })
        .to(open, { opacity: 1, duration: 0.5 }, 0.2)
        .to(menuTextWrap, { opacity: 1, ease: "power2.out" }, 0)
        .to(nav, { opacity: 0, duration: 0.65 }, 0.1)
        .set(nav, { display: "none", duration: 0 });
      document.body.classList.remove("menu-open");
    }

    menuOpen = !menuOpen;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#sccont"),
    smooth: true,
    lerp: 0.08,
    multiplier: 0.6,
  });

  initializeScrollTrigger(locoScroll);

  const gothamUltra = new FontFaceObserver("Gotham Ultra");
  const introAnimation = new IntroAnimation();

  initializeCanvasAnimations();
  setupMenuAnimation();
  FadeinDate();

  if (window.matchMedia("(min-width: 991px)").matches) {
    initializeHoverAnimations();
    setupArtigoWrapHover();
  }

  changeBurgerlineColorOnSection(
    ".footersec",
    ".burguerline.black",
    "#fefefe",
    "#101010"
  );
  changeBurgerlineColorOnSection(
    ".footersec",
    ".language",
    "#fefefe",
    "#101010",
    "color"
  );

  gothamUltra
    .load()
    .then(() => introAnimation.handleFontLoadSuccess(performance.now()))
    .catch(() => introAnimation.handleFontLoadFailure(performance.now()));
});
