// intro.js

import { initBreakpoints, onBreakpoint } from './breakpointsConfig.js'
import { scrollex, unscrollex } from '@js/scrollex.js'

export function initIntro() {
  const introEl = document.querySelector('#intro')
  const mainEl = document.querySelector('#main')

  initBreakpoints()

  if (!introEl || !mainEl) return

  // IE-specific fix for intro height
  const handleIntroResize = () => {
    const introHeight = introEl.offsetHeight
    const windowHeight = window.innerHeight
    introEl.style.height =
      introHeight > windowHeight ? 'auto' : `${introHeight}px`
  }

  if (navigator.userAgent.includes('Trident')) {
    window.addEventListener('resize', handleIntroResize)
    handleIntroResize()
  }

  // Helper to attach scrollex observers safely
  const attachScrollex = (mode, topOffset, bottomOffset) => {
    // Remove old observers
    unscrollex(mainEl)

    scrollex(mainEl, {
      mode: 'middle',
      top: topOffset,
      bottom: bottomOffset,
      enter: () => introEl.classList.add('hidden'),
      leave: () => introEl.classList.remove('hidden')
    })
  }

  // Breakpoint-specific scrollex offsets
  onBreakpoint('>small', () => {
    attachScrollex('bottom', '25vh', '-50vh')
  })

  onBreakpoint('<=small', () => {
    attachScrollex('middle', '20vh', '-40vh')
  })

  // Optional: keep IE height fix synced with breakpoints
  if (navigator.userAgent.includes('Trident')) {
    onBreakpoint('>small', handleIntroResize)
    onBreakpoint('<=small', handleIntroResize)
  }
}
