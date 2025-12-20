import gsap from "gsap"
// import { ScrollTrigger } from "gsap/ScrollTrigger"
import { applyRandomTheme } from "@/scripts/utils"

const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches || window.innerWidth < 768
const randomChar = "!@#$%&/TA01XYZ"

export const addSlideFadeinAnimation = (tl, items) => {
  const slideFadeinEles = gsap.utils.toArray(items);
  const offsetAnims = slideFadeinEles.filter(el => el.matches('.progress-line, .dot')); 
  const staggerAnims = slideFadeinEles.filter(el => !el.matches('.progress-line, .dot'));

  if (staggerAnims.length > 0) {
    tl.fromTo(staggerAnims, 
      { 
        opacity: 0,
        scaleX: (i, target) => target.matches(".scale-x") ? 0 : 1,
        y: () => isMobile ? 0 : 35,
        willChange: "transform, opacity"
      },
      { y: 0, opacity: 1, scaleX: 1, duration: 0.7, stagger: 0.07, ease: "back.inOut"},
      "<0.1"
    )
  }

  if (offsetAnims.length > 0) {
    tl.fromTo(offsetAnims, 
      { scale: 0, opacity: 0, willChange: "transform, opacity" }, 
      { scale: 1, opacity: 1, duration: 0.7, stagger: 0.6, ease: "back.inOut" },
      "<0.5"
    );
  }
}

export const onLoading = () => {
  window.scrollTo({ top: 0, behavior: "instant" });
  const loader = document.getElementById("app-loader");
  if (!loader) return;

  const fill = loader.querySelector(".loader-line-fill");
  const percent = loader.querySelector(".status-percent");
  const text = loader.querySelector(".status-text");
  const slideFadein = document.querySelectorAll(".router-elem-slide-fadein");

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

  addSlideFadeinAnimation(tl, slideFadein)
}

export const onLeave = (el, done) => {
  const fadeout = el.querySelectorAll(".router-elem-fade")
  
  if (fadeout.length === 0) {
    done()
    return
  }

  const tl = gsap.timeline({ 
    onComplete: () => {
      done();
    } 
  })

  tl.to(fadeout, {
    opacity: 0,
    duration: 0.7,
    stagger: 0,
    ease: "power3.inOut"
  })
}

export const onEnter = async (el, done, configStore) => {
  window.scrollTo({ top: 0, behavior: "instant" });

  requestAnimationFrame(() => {
    applyRandomTheme(configStore)
  })

  const fadein = el.querySelectorAll(".router-elem-fade")
  const slideFadein = el.querySelectorAll(".router-elem-slide-fadein")

  if (fadein.length === 0 && slideFadein.length === 0) {
    done()
    return
  }

  const tl = gsap.timeline({ 
    onComplete: () => {
      done();
    } 
  })

  if (fadein.length > 0) {
    tl.fromTo(fadein, 
      { opacity: 0, },
      { opacity: 1, duration: 0.6, stagger: 0.06, ease: "power2.out" }
    )
  }
  addSlideFadeinAnimation(tl, slideFadein)
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
