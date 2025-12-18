import gsap from "gsap"
import { applyRandomTheme } from "@/scripts/utils"

const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches || window.innerWidth < 768
const randomChar = "!@#$%^&*()<>?/.,;'-=_+`~|[]{}"

export const onLoading = () => {
	const loader = document.getElementById("app-loader")
  if (loader) {
		const fill = loader.querySelector(".loader-line-fill")
		const percent = loader.querySelector(".status-percent")
		const text = loader.querySelector(".status-text")
		const slideFadein = document.querySelectorAll(".router-elem-slide-fadein")
		
		const tl = gsap.timeline({
			onComplete: () => {
				loader.remove();
			}
		})

		tl.to(fill, {
			width: "100%", 
			duration: 0.8,
			ease: "power3.inOut",
			onUpdate: function() {
				const p = Math.round(this.progress() * 100)
				if(percent) percent.innerText = p < 100 ? `0${p}%`.slice(-3) : "OK"
			}
		})
		
		tl.to(text, {
			duration: 0.5,
			// text: "DONE.",
			scrambleText: { text: "DONE.", chars: randomChar, speed: 1, revealDelay: 0.05 },
			ease: "none"
			// onStart: () => { if(text) text.innerText = "DONE." }
		}, ">0.5")

		tl.to(".loader-container", {
			opacity: 0,
			duration: 0.4,
			ease: "power2.in"
		}, ">1.5")

		tl.to(loader, {
			opacity: 0,
			duration: 0.6,
			ease: "power2.inOut"
		}, ">0.4")


		if (slideFadein.length > 0) {
			tl.fromTo(slideFadein, 
			{ 
				y: isMobile ? 0 : 30, 
				opacity: 0 
			},
			{
				y: 0,
				opacity: 1,
				duration: 0.6,
				stagger: 0.06,
				ease: "power2.inOut"
			}, ">")
		}
	}
}

export const onLeave = (el, done) => {
  const fadeout = el.querySelectorAll(".router-elem-fade")
  
  if (fadeout.length === 0) {
    done()
    return
  }

  const tl = gsap.timeline({ onComplete: done })
  tl.to(fadeout, {
    opacity: 0,
    duration: 0.7,
    stagger: 0,
    ease: "power4.inOut"
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

  const tl = gsap.timeline({ onComplete: done })

  if (fadein.length > 0) {
    tl.fromTo(fadein, 
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.6,
      stagger: 0.06,
      ease: "power2.out"
    })
  }

  tl.fromTo(slideFadein, 
  { 
    opacity: 0,
    scaleX: (i, target) => target.tagName === 'HR' ? 0 : 1,
    y: (i, target) => target.tagName === 'HR' ? 0 : isMobile ? 0 : 30,
  },
  {
		y: 0,
		opacity: 1,
		scaleX: 1,
		duration: 0.6,
		stagger: 0.06,
		ease: "power2.inOut"
	}, "<0.1")
}
