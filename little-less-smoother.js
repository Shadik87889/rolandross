// Mobile Menu
const menuToggle = document.getElementById("menu-toggle");
const drawer = document.getElementById("mobile-drawer");
let menuOpen = false;

// Inject custom SVG for the premium morphing button
menuToggle.innerHTML = `
  <svg viewBox="0 0 24 24" width="28" height="28" style="overflow: visible;">
    <path id="menu-line-top" d="M3 9h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
    <path id="menu-line-bottom" d="M3 15h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
  </svg>
`;

const svgIcon = menuToggle.querySelector("svg");
const lineTop = menuToggle.querySelector("#menu-line-top");
const lineBottom = menuToggle.querySelector("#menu-line-bottom");

gsap.set([lineTop, lineBottom], { transformOrigin: "50% 50%" });

menuToggle.addEventListener("click", () => {
  menuOpen = !menuOpen;
  const tl = gsap.timeline();

  if (menuOpen) {
    drawer.classList.add("active");
    menuToggle.classList.add("text-white");
    lenis.stop();

    /* --- WORLD CLASS BUTTON MORPH --- */
    tl.to(lineTop, { y: -3, duration: 0.2, ease: "power2.out" }, 0)
      .to(lineBottom, { y: 3, duration: 0.2, ease: "power2.out" }, 0)
      .to(svgIcon, { rotation: 90, duration: 0.6, ease: "expo.inOut" }, 0.15)
      .to(
        lineTop,
        { y: 3, rotation: 45, duration: 0.6, ease: "expo.inOut" },
        0.15,
      )
      .to(
        lineBottom,
        { y: -3, rotation: -45, duration: 0.6, ease: "expo.inOut" },
        0.15,
      );

    /* --- SNAPPIER, FIRMER LINK REVEAL --- */
    gsap.fromTo(
      ".drawer-link",
      {
        y: 25, // Reduced distance so it doesn't drag
        opacity: 0,
        rotationX: -50, // Slightly tighter angle
        transformOrigin: "top",
        transformPerspective: 800,
        filter: "blur(8px)", // Slightly less blur to match the speed
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        filter: "blur(0px)",
        duration: 0.75, // Much faster! (Was 1.4)
        stagger: 0.06, // Quicker cascade
        ease: "power3.out", // Firmer stop, eliminates the "floating up" at the end
        delay: 0.1,
        force3D: true,
      },
    );
  } else {
    drawer.classList.remove("active");
    menuToggle.classList.remove("text-white");
    lenis.start();

    /* --- BUTTON CLOSE ANIMATION --- */
    tl.to(svgIcon, { rotation: 0, duration: 0.6, ease: "expo.inOut" }, 0)
      .to(lineTop, { y: -3, rotation: 0, duration: 0.6, ease: "expo.inOut" }, 0)
      .to(
        lineBottom,
        { y: 3, rotation: 0, duration: 0.6, ease: "expo.inOut" },
        0,
      )
      .to(lineTop, { y: 0, duration: 0.35, ease: "back.out(2)" }, 0.6)
      .to(lineBottom, { y: 0, duration: 0.35, ease: "back.out(2)" }, 0.6);

    /* --- SNAPPY LINK EXIT --- */
    gsap.to(".drawer-link", {
      y: 10,
      opacity: 0,
      duration: 0.25,
      stagger: 0.02,
      ease: "power2.in",
    });
  }
});
