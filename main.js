function setInitialStates() {
  const title = document.querySelector(".title");
  const letters = new SplitType(title, { types: "chars" }).chars;
  const introP = document.querySelector(".intro-p");
  const lines = new SplitType(introP, { types: "lines" }).lines;
  const heroImg = document.querySelector(".heroimg");
  const language = document.querySelector(".language");
  const menu = document.querySelector(".menu_icon_wrap");

  gsap.set(language, {
    y: "100%",
  });

  gsap.set(menu, {
    opacity: 0,
  });

  gsap.set(heroImg, {
    clipPath: "inset(100% 0 0 0)",
  });

  gsap.set(letters, {
    opacity: 1,
    y: "100%",
  });

  gsap.set(lines, {
    y: "100%",
  });

  gsap.set(lines, {
    y: "100%",
  });

  lines.forEach((line) => {
    // Crie o novo elemento wrap
    const parentLine = document.createElement("div");
    parentLine.classList.add("parent-line");

    // Insira a linha original dentro do wrapper
    line.parentNode.insertBefore(parentLine, line);
    parentLine.appendChild(line);
  });

  return { letters, lines, heroImg, menu, language };
}

function removeLinesAndKeepText() {
  const container = document.querySelector(".intro-p");
  const parentLines = document.querySelectorAll(".parent-line");

  parentLines.forEach((parentLine) => {
    // Cria um nó de texto com o conteúdo das linhas dentro do parent-line
    const textContent = Array.from(parentLine.querySelectorAll(".line"))
      .map((line) => line.textContent)
      .join(" ");
    const textNode = document.createTextNode(textContent + " ");

    // Insere o nó de texto antes do elemento parent-line
    container.insertBefore(textNode, parentLine);

    // Remove o elemento parent-line
    parentLine.remove();
  });
}
window.addEventListener("resize", removeLinesAndKeepText);

function introAnimation(
  letters,
  lines,
  heroImg,
  menu,
  language,
  introWrap,
  remainingTime
) {
  CustomEase.create("outCircle", "M0,0 C0.075,0.82 0.165,1 1,1");

  const timeline = gsap.timeline({
    defaults: {
      duration: 1,
      ease: "power2.out",
    },
  });

  gsap.set([letters, lines], { y: "0%" });
  const d = remainingTime / 1000 + 0.75;

  timeline
    .to(
      introWrap,
      {
        opacity: 0,
        display: "none",
        ease: "power1.inOut",
        duration: 0.7,
      },
      remainingTime / 1000
    )
    .from(
      letters,
      {
        opacity: 0,
        y: "100%",

        stagger: {
          from: "center",
          amount: 0.4,
        },
      },
      d
    )
    .from(
      lines,
      {
        y: "100%",
        stagger: 0.15,
        ease: "power2.out",
      },
      d + 0.5
    )
    .to(
      heroImg,
      {
        clipPath: "inset(0% 0 0 0)",
        ease: "outCircle",
        duration: 1.3,
      },
      d + 0.8
    )
    .to(
      menu,
      {
        opacity: 1,
      },
      d - 0.2
    )
    .to(
      language,
      {
        y: "0%",
      },
      d
    );

  return timeline;
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

function setupFontLoading(introWrap, gothamUltra) {
  const start = performance.now();
  gothamUltra
    .load()
    .then(() => {
      handleFontLoadSuccess(introWrap, start);
    })
    .catch(() => {
      handleFontLoadFailure(introWrap, start);
    });
}

function handleFontLoadSuccess(introWrap, start) {
  const end = performance.now();
  const duration = end - start;
  const MIN_SHOW_TIME = 2000;
  const remainingTime = Math.max(MIN_SHOW_TIME - duration, 0);
  const { letters, lines, heroImg, menu, language } = setInitialStates();

  introAnimation(
    letters,
    lines,
    heroImg,
    menu,
    language,
    introWrap,
    remainingTime
  );

  console.log(`Fonte Gotham Ultra carregada em ${duration}ms`);
}

function handleFontLoadFailure(introWrap, start) {
  console.error("Conexão fraca");
  setTimeout(() => {
    handleFontLoadSuccess(introWrap, start);
  }, 5000);
}

function hexToRGB(hex) {
  hex = hex.replace(/^#/, "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b];
}

function setupColorAnimation(initialBegeRGB) {
  gsap.to(":root", {
    scrollTrigger: {
      trigger: ".hero",
      scroller: "#sccont",
      start: "top",
      end: "bottom center",
      scrub: true,
    },
    ease: "power1.Out",
    onUpdate: function () {
      const progress = this.progress();
      const endColor = [16, 16, 16];
      const currentColor = initialBegeRGB.map((start, index) => {
        const end = endColor[index];
        return Math.round(start + (end - start) * progress);
      });
      const colorString = `rgb(${currentColor.join(",")})`;
      document.documentElement.style.setProperty("--beige", colorString);
    },
  });
}

document.addEventListener("DOMContentLoaded", (event) => {
  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#sccont"),
    smooth: true,
    lerp: 0.08,
    multiplier: 0.6,
  });

  initializeScrollTrigger(locoScroll);

  const introWrap = document.querySelector(".intro_wrap");
  const gothamUltra = new FontFaceObserver("Gotham Ultra");
  setupFontLoading(introWrap, gothamUltra);

  const initialBegeHex = getComputedStyle(document.documentElement)
    .getPropertyValue("--beige")
    .trim();
  const initialBegeRGB = hexToRGB(initialBegeHex);
  setupColorAnimation(initialBegeRGB);
});
