// parallax.js

import { initBreakpoints } from '@js/breakpointsConfig.js'
import browser from '@js/browser.min.js'

export function initParallax(wrapper) {
  const wrapperEl =
    typeof wrapper === 'string' ? document.querySelector(wrapper) : wrapper
  if (!wrapperEl) return

  initBreakpoints()

  function applyParallax(intensity = 0.25) {
    if (!wrapperEl || intensity === 0) return

    const bg = document.createElement('div')
    bg.className = 'bg'
    wrapperEl.appendChild(bg)

    const updateParallax = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const offsetTop = wrapperEl.getBoundingClientRect().top + scrollTop
      const pos = scrollTop - offsetTop
      bg.style.transform = `matrix(1,0,0,1,0,${pos * intensity})`
    }

    const enableParallax = () => {
      bg.classList.remove('fixed')
      bg.style.transform = 'matrix(1,0,0,1,0,0)'
      window.addEventListener('scroll', updateParallax)
    }

    const disableParallax = () => {
      bg.classList.add('fixed')
      bg.style.transform = 'none'
      window.removeEventListener('scroll', updateParallax)
    }

    // Disable on IE, Edge, mobile or high DPI
    if (
      browser.name === 'ie' ||
      browser.name === 'edge' ||
      window.devicePixelRatio > 1 ||
      browser.mobile
    ) {
      disableParallax()
    } else {
      breakpoint.on('>large', enableParallax)
      breakpoint.on('<=large', disableParallax)
    }

    const triggerScroll = () => {
      updateParallax()
    }

    // Mimic jQuery's load/resize scroll trigger
    window.removeEventListener('load', triggerScroll)
    window.removeEventListener('resize', triggerScroll)
    window.addEventListener('load', triggerScroll)
    window.addEventListener('resize', triggerScroll)
  }

  applyParallax(0.925)
}
