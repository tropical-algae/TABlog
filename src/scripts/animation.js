import gsap from "gsap"
import { applyRandomTheme } from "@/scripts/utils"

const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches || window.innerWidth < 768
const randomChar = "!@#$%&/TA01XYZ"

export const onLoading = () => {
  window.scrollTo({ top: 0, behavior: "instant" });
  const loader = document.getElementById("app-loader");
  if (!loader) return;

  const fill = loader.querySelector(".loader-line-fill");
  const percent = loader.querySelector(".status-percent");
  const text = loader.querySelector(".status-text");
  const slideFadein = document.querySelectorAll(".router-elem-slide-fadein");
  const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.set([slideFadein, ".loader-container", loader], { clearProps: "will-change" });
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

  if (slideFadein.length > 0) {
		tl.fromTo(slideFadein, 
		{ 
			opacity: 0,
			scaleX: (i, target) => target.tagName === "HR" ? 0 : 1,
			y: (i, target) => target.tagName === "HR" ? 0 : isMobile ? 0 : 24,
			willChange: "transform, opacity"
		},
		{
			y: 0,
			opacity: 1,
			scaleX: 1,
			duration: 0.8,
			stagger: 0.08,
			ease: "power2.inOut"
		}, "<0.1")
  }
}

export const onLeave = (el, done) => {
  const fadeout = el.querySelectorAll(".router-elem-fade")
  
  if (fadeout.length === 0) {
    done()
    return
  }

  const tl = gsap.timeline({ 
    onComplete: () => {
      gsap.set(fadeout, { clearProps: "will-change" });
      done();
    } 
  })

  tl.to(fadeout, {
		willChange: "opacity",
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
  const slideFadeinEles = gsap.utils.toArray(slideFadein);
  const offsetAnims = slideFadeinEles.filter(el => el.matches('.progress-line, .dot')); 
  const staggerAnims = slideFadeinEles.filter(el => !el.matches('.progress-line, .dot'));

  if (fadein.length === 0 && slideFadein.length === 0) {
    done()
    return
  }

  const tl = gsap.timeline({ 
    onComplete: () => {
      gsap.set([fadein, slideFadein], { clearProps: "will-change" });
      done();
    } 
  })

  if (fadein.length > 0) {
    tl.fromTo(fadein, 
    { 
      opacity: 0,
      willChange: "opacity" 
    },
    {
      opacity: 1,
      duration: 0.6,
      stagger: 0.06,
      ease: "power2.out"
    })
  }

  if (staggerAnims.length > 0) {
    tl.fromTo(staggerAnims, 
    { 
      opacity: 0,
      scaleX: (i, target) => target.matches(".scale-x") ? 0 : 1,
      y: (i, target) => target.matches(".scale-x") ? 0 : isMobile ? 0 : 24,
      willChange: "transform, opacity"
    },
    { y: 0, opacity: 1, scaleX: 1, duration: 0.8, stagger: 0.08, ease: "power2.inOut"},
    "<0.1")
  }

  if (offsetAnims.length > 0) {
    tl.fromTo(offsetAnims, 
      { scale: 0, opacity: 0, willChange: "transform, opacity" }, 
      { scale: 1, opacity: 1, duration: 0.7, stagger: 0.6, ease: "back.inOut" },
      ">-1"
    );
  }
}
