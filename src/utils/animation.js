import gsap from "gsap"
// import { ScrollTrigger } from "gsap/ScrollTrigger"

const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches || window.innerWidth < 768
const randomChar = "!@#$%&/TA01XYZ"
const slideMod = ".anim-slide";
const scaleMod = ".anim-scale";

const addFadeinAnimation = (tl, elems) => {
  if (elems.length > 0) {
    tl.fromTo(elems, 
      { opacity: 0, },
      { opacity: 1, 
        duration: 2.0, 
        stagger: 0.1, 
        ease: "power2.out",
        onStart: function() {
          gsap.set(this.targets(), { willChange: "transform, opacity" });
        },
        onComplete: function() {
          gsap.set(this.targets(), { clearProps: "willChange" });
        }
      }, "<"
    )
  }
}

const addSlideFadeinAnimation = (tl, elems) => {
  if (elems.length > 0) {
    tl.fromTo(elems, 
      { 
        opacity: 0,
        scaleX: (i, target) => isMobile ? 1 : target.matches(".scale-x") ? 0 : 1,
        scaleY: (i, target) => isMobile ? 1 : target.matches(".scale-y") ? 0 : 1,
        y: () => isMobile ? 0 : 40,
      },
      { 
        y: 0, 
        opacity: 1, 
        scaleX: 1, 
        scaleY: 1, 
        duration: 1.2, 
        stagger: 0.09, 
        ease: "back.inOut(1.9)", 
        onStart: function() {
          gsap.set(this.targets(), { willChange: "transform, opacity" });
        },
        onComplete: function() {
          gsap.set(this.targets(), { clearProps: "willChange" });
        }
      }, "<0.15"
    )
  }
}

const addScaleFadeinAnimation = (tl, elems) => {
  if (elems.length > 0) {
    tl.fromTo(elems, 
      { 
        scale: 0, 
        opacity: 0
      }, 
      { 
        scale: 1, 
        opacity: 1, 
        duration: 1.0, 
        stagger: 0.45, 
        ease: "back.inOut(1.9)", 
        onStart: function() {
          gsap.set(this.targets(), { willChange: "transform, opacity" });
        },
        onComplete: function() {
          gsap.set(this.targets(), { clearProps: "willChange" });
        }
      }, "<0.15"
    );
  }
}

export const onLoading = (animClass) => {
  window.scrollTo({ top: 0, behavior: "instant" });
  const loader = document.getElementById("app-loader");
  if (!loader) return;

  const fill = loader.querySelector(".loader-line-fill");
  const percent = loader.querySelector(".status-percent");
  const text = loader.querySelector(".status-text");

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.set([".loader-container", loader], { clearProps: "will-change" });
      loader.remove();
    }
  });

  tl.to(fill, {
    width: "100%",
    duration: 0.8,
    ease: "power3.inOut",
    onUpdate: function() {
      const p = Math.round(this.progress() * 100);
      if (percent) percent.innerText = p < 100 ? `0${p}%`.slice(-3) : "OK";
    }
  });

  tl.to(text, {
    duration: 0.5,
    scrambleText: { text: "DONE.", chars: randomChar, speed: 1, revealDelay: 0.05 },
    ease: "none"
  }, ">0.5");

  tl.to([".loader-container", loader], {
    willChange: "opacity",
    opacity: 0,
    duration: 0.6,
    stagger: 0.2,
    ease: "power2.inOut"
  }, ">1.0");

  addFadeinAnimation(tl, document.querySelectorAll(`${animClass}:not(${slideMod}):not(${scaleMod})`))
  addSlideFadeinAnimation(tl, document.querySelectorAll(`${animClass}${slideMod}`))
  addScaleFadeinAnimation(tl, document.querySelectorAll(`${animClass}${scaleMod}`))
}

export const onLeave = (el, done, animClass) => {
  const fadeElems = el.querySelectorAll(animClass)

  if (fadeElems.length === 0) {
    done()
    return
  }

  const tl = gsap.timeline({ 
    onComplete: () => {
      done();
    } 
  });


  tl.to(fadeElems, 
    { opacity: 0, duration: 0.7, stagger: 0, ease: "power3.inOut" }
  )
}

export const onEnter = (el, done, animClass) => {
  window.scrollTo({ top: 0, behavior: "instant" });

  const scaleElems = el.querySelectorAll(`${animClass}${scaleMod}`);
  const slideElems = el.querySelectorAll(`${animClass}${slideMod}`);
  const fadeElems = el.querySelectorAll(`${animClass}:not(${slideMod}):not(${scaleMod})`);

  if (scaleElems.length + slideElems.length + fadeElems.length === 0) {
    done()
    return
  }

  const tl = gsap.timeline({ 
    onComplete: () => {
      done();
    } 
  });

  addFadeinAnimation(tl, fadeElems)
  addSlideFadeinAnimation(tl, slideElems)
  addScaleFadeinAnimation(tl, scaleElems)
}

// export async function initBasicScrollAnimations(itemClass) {
//   ScrollTrigger.getAll().forEach(t => t.kill())
//   const bubbles = gsap.utils.toArray(itemClass)
//   // gsap.set(bubbles, { opacity: 0 }) 

//   ScrollTrigger.batch(itemClass, {
//     // markers: true,
//     start: "top 95%", 
//     end: "bottom 5%",

//     onEnter: batch => {
//       gsap.fromTo(batch, 
//         { y: 30, opacity: 0 },
//         { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out", overwrite: true }
//       )
//     },

//     // onEnterBack: batch => {
//     //   gsap.to(batch, {
//     //     opacity: 1, y: 0, stagger: 0.1, duration: 1, ease: "power3.out", overwrite: true 
//     //   })
//     // },

//     onLeaveBack: batch => {
//       gsap.to(batch, {
//          opacity: 0, y: 80, duration: 1, ease: "power2.in", overwrite: true 
//       })
//     },

//     // onLeave: batch => {
//     //   gsap.to(batch, { 
//     //     opacity: 0, y: -80, duration: 1, ease: "power2.in", overwrite: true 
//     //   })
//     // }
//   })
// }
