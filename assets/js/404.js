const isMobileOrTablet = window.matchMedia("(max-width: 991px)").matches;

class IntroAnimation {
  constructor() {
    this.introWrap = document.querySelector(".intro_wrap");
    this.language = document.querySelector(".menu_text_wrap");
    this.menu = document.querySelector(".menu_icon_wrap");

  }
  setInitialStates() {
    gsap.set(this.language, { y: "100%" });
    gsap.set(this.menu, { opacity: 0 });
    gsap.set(this.introWrap, { opacity: 1 });
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
      .to(this.language, { y: "0%" }, d);



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

  const gothamUltra = new FontFaceObserver("Gotham Ultra");
  const introAnimation = new IntroAnimation();

  if (window.matchMedia("(min-width: 991px)").matches) {
    initializeHoverAnimations();
  }

  setupMenuAnimation();


  gothamUltra
    .load()
    .then(() => introAnimation.handleFontLoadSuccess(performance.now()))
    .catch(() => introAnimation.handleFontLoadFailure(performance.now()));
});
