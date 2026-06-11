const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
const coarsePointerQuery = window.matchMedia("(hover: none) and (pointer: coarse)")

export const MOTION_SCOPES = {
  route: "route",
  archiveList: "archive-list"
}

export const MOTION_CANCEL = {
  preserve: "preserve",
  cleanup: "cleanup"
}

const baseEase = {
  enter: "cubic-bezier(0.34, 1, 0.64, 1)",
  fade: "cubic-bezier(0.24, 1, 0.34, 1)",
  leave: "cubic-bezier(0.64, 0, 0.34, 1)"
}

const defaultTransition = {
  enter: {
    duration: 650,
    stagger: 80,
    easing: baseEase.enter
  },
  leave: {
    duration: 260,
    stagger: 0,
    easing: baseEase.leave
  }
}

const presets = {
  fade: {
    enterFrom: () => ({ opacity: 0 }),
    enterTo: base => ({ opacity: base.opacity }),
    enterEasing: baseEase.fade
  },
  slide: {
    enterFrom: base => ({
      opacity: 0,
      transform: composeTransform(base.transform, getSlideTransform(base.elem))
    }),
    enterTo: base => ({
      opacity: base.opacity,
      transform: composeTransform(base.transform, "translate(0, 0)")
    })
  },
  scale: {
    enterFrom: base => ({
      opacity: 0,
      transform: composeTransform(base.transform, "scale3d(0, 0, 1)")
    }),
    enterTo: base => ({
      opacity: base.opacity,
      transform: composeTransform(base.transform, "scale3d(1, 1, 1)")
    })
  }
}

const running = new WeakMap()
const rootRuns = new WeakMap()

function shouldReduceMotion() {
  return reduceMotionQuery.matches
}

function nextAnimationFrame() {
  return new Promise(resolve => {
    requestAnimationFrame(resolve)
  })
}

function getSlideDistance() {
  return coarsePointerQuery.matches || window.innerWidth < 768 ? 0 : 40
}

function getSlideTransform(elem) {
  const x = toNumber(elem?.dataset.motionX, 0)
  const y = toNumber(elem?.dataset.motionY, getSlideDistance())

  return `translate(${x}px, ${y}px)`
}

function composeTransform(baseTransform, motionTransform) {
  return baseTransform
    ? `${baseTransform} ${motionTransform}`
    : motionTransform
}

function normalizeTransform(transform) {
  return transform && transform !== "none" ? transform : ""
}

function toNumber(value, fallback) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function escapeScope(scope) {
  return String(scope).replace(/["\\]/g, "\\$&")
}

function getScopeSelector(scope) {
  return `[data-motion-scope~="${escapeScope(scope)}"][data-motion]`
}

function readComputedFrame(elem) {
  const style = getComputedStyle(elem)
  return createFrame({
    elem,
    opacity: style.opacity || "1",
    transform: normalizeTransform(style.transform)
  })
}

function createFrame(frame) {
  const normalized = {}

  if ("opacity" in frame) {
    normalized.opacity = frame.opacity
  }

  if (frame.transform) {
    normalized.transform = frame.transform
  }

  return normalized
}

function getBaseFrame(elem, refresh = false) {
  const state = running.get(elem)
  if (state?.baseFrame) return state.baseFrame

  return readComputedFrame(elem)
}

function beginRootRun(root) {
  const previous = rootRuns.get(root)
  if (previous) previous.cancelled = true

  const run = { cancelled: false }
  rootRuns.set(root, run)
  return run
}

function normalizeCancelMode(options = MOTION_CANCEL.preserve) {
  if (typeof options === "boolean") {
    return options ? MOTION_CANCEL.cleanup : MOTION_CANCEL.preserve
  }

  const mode = typeof options === "string" ? options : options.mode
  return Object.values(MOTION_CANCEL).includes(mode) ? mode : MOTION_CANCEL.preserve
}

function cancelMotionElement(elem, options = MOTION_CANCEL.preserve) {
  const mode = normalizeCancelMode(options)
  const state = running.get(elem)
  if (!state?.animation) {
    if (mode === MOTION_CANCEL.cleanup) clearMotionStyles(elem)
    running.delete(elem)
    return
  }

  const currentFrame = readComputedFrame(elem)
  state.animation.cancel()
  running.delete(elem)

  if (mode === MOTION_CANCEL.cleanup) {
    clearMotionStyles(elem)
  } else {
    applyFrame(elem, currentFrame)
  }
}

function cancelTargets(root, scope, options = MOTION_CANCEL.preserve) {
  beginRootRun(root)
  getTargets(root, scope).forEach(elem => cancelMotionElement(elem, options))
}

function applyFrame(elem, frame) {
  if ("opacity" in frame) {
    elem.style.opacity = String(frame.opacity)
  }

  if ("transform" in frame) {
    elem.style.transform = frame.transform || ""
  }
}

function clearMotionStyles(elem) {
  elem.style.opacity = ""
  elem.style.transform = ""
}

function getPreset(elem) {
  return presets[elem.dataset.motion] || presets.fade
}

function getTargets(root, scope) {
  const selector = getScopeSelector(scope)
  const targets = root.matches?.(selector)
    ? [root, ...root.querySelectorAll(selector)]
    : Array.from(root.querySelectorAll(selector))

  return targets.sort((a, b) => {
    const aOrder = toNumber(a.dataset.motionOrder, Number.NaN)
    const bOrder = toNumber(b.dataset.motionOrder, Number.NaN)

    if (Number.isNaN(aOrder) && Number.isNaN(bOrder)) return 0
    if (Number.isNaN(aOrder)) return 1
    if (Number.isNaN(bOrder)) return -1
    return aOrder - bOrder
  })
}

function getTiming(elem, phase, index, options) {
  const preset = getPreset(elem)
  const defaults = defaultTransition[phase]
  const phaseOptions = options[phase] || {}
  const stagger = phaseOptions.stagger ?? defaults.stagger
  const maxStaggerItems = phaseOptions.maxStaggerItems ?? Number.POSITIVE_INFINITY
  const order = toNumber(elem.dataset.motionOrder, index)
  const staggerIndex = Math.min(order, maxStaggerItems)

  return {
    duration: toNumber(elem.dataset.motionDuration, phaseOptions.duration ?? defaults.duration),
    delay: toNumber(elem.dataset.motionDelay, staggerIndex * stagger),
    easing: elem.dataset.motionEase || phaseOptions.easing || preset.enterEasing || defaults.easing,
    fill: "both"
  }
}

function hasTransform(frames) {
  return frames.some(frame => "transform" in frame)
}

function finishMotionStyles(elem, frames, cleanup) {
  if (!cleanup) return

  if (hasTransform(frames)) {
    const finalFrame = frames[frames.length - 1]
    elem.style.opacity = ""
    elem.style.transform = finalFrame.transform || ""
    return
  }

  clearMotionStyles(elem)
}

function startAnimation(elem, frames, timing, baseFrame, cleanup) {
  if (!elem.animate || shouldReduceMotion()) {
    finishMotionStyles(elem, frames, cleanup)
    return Promise.resolve()
  }

  const previous = running.get(elem)
  const currentFrame = previous?.animation
    ? readComputedFrame(elem)
    : frames[0]

  previous?.animation?.cancel()
  applyFrame(elem, currentFrame)

  const animation = elem.animate([currentFrame, frames[1]], timing)
  running.set(elem, { animation, baseFrame })

  return animation.finished
    .catch(() => {})
    .finally(() => {
      if (running.get(elem)?.animation !== animation) return
      running.delete(elem)
      finishMotionStyles(elem, frames, cleanup)
    })
}

function buildEnterFrames(elem, refreshBaseFrame = false) {
  const state = running.get(elem)
  const baseFrame = {
    elem,
    ...getBaseFrame(elem, refreshBaseFrame)
  }
  const preset = getPreset(elem)
  const fromFrame = state
    ? readComputedFrame(elem)
    : preset.enterFrom(baseFrame)

  return {
    baseFrame,
    frames: [
      fromFrame,
      preset.enterTo(baseFrame)
    ]
  }
}

function buildLeaveFrames(elem) {
  const baseFrame = {
    elem,
    ...getBaseFrame(elem)
  }
  const currentFrame = readComputedFrame(elem)

  return {
    baseFrame,
    frames: [
      currentFrame,
      createFrame({
        opacity: 0,
        transform: currentFrame.transform
      })
    ]
  }
}

function primeEnter(targets, options = {}) {
  const prepared = targets.map(elem => {
    const item = buildEnterFrames(elem, options.refreshBaseFrame)
    return { elem, ...item }
  })

  for (const { elem, frames, baseFrame } of prepared) {
    applyFrame(elem, frames[0])
    running.set(elem, { ...running.get(elem), baseFrame })
  }

  return prepared
}

function runPrepared(prepared, phase, options, cleanup) {
  return Promise.all(
    prepared.map(({ elem, frames, baseFrame }, index) =>
      startAnimation(elem, frames, getTiming(elem, phase, index, options), baseFrame, cleanup)
    )
  )
}

function prepareLeave(targets) {
  return targets.map(elem => ({ elem, ...buildLeaveFrames(elem) }))
}

function notifyEnterStart(runtime) {
  try {
    runtime.onEnterStart?.()
  } catch (err) {
    console.error("[motion enter start error]", err)
  }
}

export function createMotionTransition(options = {}) {
  const config = {
    ...defaultTransition,
    ...options,
    enter: {
      ...defaultTransition.enter,
      ...options.enter
    },
    leave: {
      ...defaultTransition.leave,
      ...options.leave
    }
  }

  return {
    enter(root, done, runtime = {}) {
      const run = beginRootRun(root)

      if (config.scrollToTop) {
        window.scrollTo({ top: 0, behavior: "instant" })
      }

      const targets = getTargets(root, config.scope)
      if (targets.length === 0 || shouldReduceMotion()) {
        targets.forEach(clearMotionStyles)
        notifyEnterStart(runtime)
        done()
        return
      }

      const prepared = primeEnter(targets)

      Promise.resolve(runtime.ready)
        .catch(err => {
          console.error("[motion ready error]", err)
        })
        .then(() => {
          if (run.cancelled) return Promise.resolve()
          notifyEnterStart(runtime)
          return runPrepared(prepared, "enter", config, true)
        })
        .then(done)
    },

    leave(root, done) {
      beginRootRun(root)

      const targets = getTargets(root, config.scope)
      if (targets.length === 0 || shouldReduceMotion()) {
        done()
        return
      }

      runPrepared(prepareLeave(targets), "leave", config, false).then(done)
    },

    enterElement(elem, done, runtime = {}) {
      const prepared = primeEnter([elem])

      Promise.resolve(runtime.ready)
        .catch(err => {
          console.error("[motion ready error]", err)
        })
        .then(() => {
          notifyEnterStart(runtime)
          return runPrepared(prepared, "enter", config, true)
        })
        .then(done)
    },

    leaveElement(elem, done) {
      runPrepared(prepareLeave([elem]), "leave", config, false).then(done)
    },

    enterTargets(root, done = () => {}, runtime = {}) {
      const run = beginRootRun(root)
      const targets = getTargets(root, config.scope)

      if (targets.length === 0 || shouldReduceMotion()) {
        targets.forEach(clearMotionStyles)
        notifyEnterStart(runtime)
        done()
        return Promise.resolve()
      }

      const prepared = primeEnter(targets, { refreshBaseFrame: true })

      return Promise.resolve(runtime.ready)
        .catch(err => {
          console.error("[motion ready error]", err)
        })
        .then(async () => {
          if (run.cancelled) return Promise.resolve()
          if (runtime.deferStart) {
            await nextAnimationFrame()
          }
          notifyEnterStart(runtime)
          return runPrepared(prepared, "enter", config, true)
        })
        .then(done)
    },

    cancel(root, options = MOTION_CANCEL.preserve) {
      cancelTargets(root, config.scope, options)
    },

    cancelElement(elem, options = MOTION_CANCEL.preserve) {
      cancelMotionElement(elem, options)
    }
  }
}

function animateProgress(duration, onUpdate) {
  if (shouldReduceMotion()) {
    onUpdate(1)
    return Promise.resolve()
  }

  return new Promise(resolve => {
    const start = performance.now()

    function update(now) {
      const progress = Math.min((now - start) / duration, 1)
      onUpdate(progress)

      if (progress < 1) {
        requestAnimationFrame(update)
      } else {
        resolve()
      }
    }

    requestAnimationFrame(update)
  })
}

export async function runInitialLoadMotion(scope, runtime = {}) {
  window.scrollTo({ top: 0, behavior: "instant" })

  const loader = document.getElementById("app-loader")
  if (!loader) {
    notifyEnterStart(runtime)
    return
  }

  const container = loader.querySelector(".loader-container")
  const fill = loader.querySelector(".loader-line-fill")
  const percent = loader.querySelector(".status-percent")
  const text = loader.querySelector(".status-text")
  const fillDuration = 650

  if (fill?.animate && !shouldReduceMotion()) {
    fill.animate(
      [{ width: "0%" }, { width: "100%" }],
      { duration: fillDuration, easing: baseEase.leave, fill: "forwards" }
    )
  }

  await animateProgress(fillDuration, progress => {
    const value = Math.round(progress * 100)
    if (percent) percent.innerText = value < 100 ? `0${value}%`.slice(-3) : "OK"
  })

  if (fill) fill.style.width = "100%"
  if (text) text.textContent = "DONE."

  await Promise.resolve(runtime.ready).catch(err => {
    console.error("[initial motion ready error]", err)
  })

  notifyEnterStart(runtime)

  const pageMotion = createMotionTransition({
    scope,
    enter: {
      duration: 650,
      stagger: 70,
      maxStaggerItems: 8
    }
  })

  const leaveLoader = Promise.all(
    [container, loader].filter(Boolean).map((elem, index) => {
      const frame = readComputedFrame(elem)

      return startAnimation(
        elem,
        [
          frame,
          createFrame({ opacity: 0, transform: frame.transform })
        ],
        {
          duration: 420,
          delay: index * 80,
          easing: baseEase.leave,
          fill: "both"
        },
        frame,
        false
      )
    })
  ).then(() => loader.remove())

  const enterPage = new Promise(resolve => {
    pageMotion.enter(document, resolve)
  })

  await Promise.all([leaveLoader, enterPage])
}
