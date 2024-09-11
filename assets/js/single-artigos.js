const isMobileOrTablet = window.matchMedia("(max-width: 991px)").matches;

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

function hexToRGB(hex) {
    hex = hex.replace(/^#/, "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
}
  
function isCSSVar(data) {
    return /^--[a-zA-Z][\w-]*$/.exec(data);
}
  
function convertCSSColorToHex(color) {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = color;
    return ctx.fillStyle;
}

function initializeScrollTrigger(locoScroll) {
    // Certifique-se de que o plugin está registrado corretamente
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
  
      // Atualize o ScrollTrigger ao rolar
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
  
      // Atualize o LocomotiveScroll e o ScrollTrigger quando necessário
      ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
      ScrollTrigger.refresh();
    } else {
      console.error("GSAP or ScrollTrigger not found");
    }
  }
  

class IntroAnimation {
  constructor() {
    this.introWrap = document.querySelector(".intro_wrap");
    this.language = document.querySelector(".menu_text_wrap");
    this.menu = document.querySelector(".menu_icon_wrap");
    this.IntroText = document.querySelector(".titulo-artigo-2");
    this.infos = document.querySelector('.informa-es-wrap-2');
    this.arrow = document.querySelector('.proxima-se-o')

  }
  
  setInitialStates() {
    gsap.set(this.language, { y: "100%" });
    gsap.set(this.menu, { opacity: 0 });
    gsap.set(this.introWrap, { opacity: 1 });

    gsap.set(this.IntroText, { opacity: 0, y: '10%' });
    gsap.set(this.infos, { opacity: 0 });
    gsap.set(this.arrow, { opacity: 0, scale: 0.9 });


    addWillChange(this.IntroText, 'transform, opacity');
    addWillChange(this.arrow, 'scale');

  }

  animateIntro(remainingTime) {
    const timeline = gsap.timeline({
      defaults: {
        duration: 1,
        ease: "power2.out",
      },
    });

    const d = remainingTime / 1000 + 0.75;

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
      .to(this.language, { y: "0%" }, d)
      .to(this.IntroText, { opacity: 1 }, d)
      .to(this.IntroText, { y:'0%', ease:'power2.out', duration:0.9 }, d)
      .to(this.infos, { opacity: 1, ease:'power2.inOut'}, d+0.4)
      .to(this.arrow, { opacity: 1, ease:'power2.inOut' }, d+0.5)
      .to(this.arrow, {scale:1}, d+0.5)


      

    return timeline;
  }

  handleFontLoadSuccess(start) {
    const end = performance.now();
    const duration = end - start;
    const MIN_SHOW_TIME = 1300;
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
          ease: "power2.inOut",
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
          .to(nav, { opacity: 0 }, 0.1)
          .set(nav, { display: "none", duration: 0 });
        document.body.classList.remove("menu-open");
      }
  
      menuOpen = !menuOpen;
    });
}

function setupAnchorNavigation(locoScroll) {
  const anchorLink = document.querySelector('.proxima-se-o');
  
  if (anchorLink) {
    const target = document.querySelector('#Conteudo');

    anchorLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      anchorLink.classList.add('active');

      // Usando Locomotive Scroll para o scroll suave
      locoScroll.scrollTo(target);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const sccontElement = document.querySelector("#sccont");
  const locoScroll = new LocomotiveScroll({
    el: sccontElement,
    smooth: true,
    lerp: 0.08,
    multiplier: 0.6,
  });
   
  initializeScrollTrigger(locoScroll);

  const gothamUltra = new FontFaceObserver("Gotham Ultra");
  const introAnimation = new IntroAnimation();

  setupMenuAnimation();
  initializeCanvasAnimations();
  setupAnchorNavigation(locoScroll);

  gothamUltra
    .load()
    .then(() => introAnimation.handleFontLoadSuccess(performance.now()))
    .catch(() => introAnimation.handleFontLoadFailure(performance.now()));
});