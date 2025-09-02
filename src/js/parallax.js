// parallax.js

import { initBreakpoints, onBreakpoint } from '@js/breakpointsConfig.js'
import browser from '@js/browser.min.js'
import bgImg from '@images/bg.webp'
import overlayImg from '@images/overlay.png'

export function initParallax(wrapper) {
  const wrapperEl =
    typeof wrapper === 'string' ? document.querySelector(wrapper) : wrapper
  if (!wrapperEl) return

  initBreakpoints()

  const images = [bgImg, overlayImg]
  let loadedCount = 0
  images.forEach((src) => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      loadedCount++
      if (loadedCount === images.length) {
        bg.classList.add('loaded') // fade in
      }
    }
  })

  // --- Responsive background-position ---
  // const updatePosition = () => {
  //   if (window.innerWidth <= 768) {
  //     bg.style.backgroundPosition = 'top center'
  //   } else {
  //     bg.style.backgroundPosition = 'center center'
  //   }
  // }

  // window.addEventListener('resize', updatePosition)
  // updatePosition()

  // function applyParallax(intensity = 0.925) {
  //   if (!wrapperEl || intensity === 0) return

  //const bg = document.createElement('div')
  //bg.className = 'bg'
  //wrapperEl.appendChild(bg)

  // Cache the initial offset position
  let intensity = 0.925
  let initialOffsetTop = null
  let isParallaxEnabled = false
  const bg = wrapperEl.querySelector('.bg')

  const updateParallax = () => {
    if (!isParallaxEnabled) return

    const scrollTop = window.scrollY || document.documentElement.scrollTop

    // Calculate initial offset only once
    if (initialOffsetTop === null) {
      initialOffsetTop = wrapperEl.offsetTop
    }

    const pos = scrollTop - initialOffsetTop
    bg.style.transform = `translate3d(0, ${pos * intensity}px, 0)`
  }

  const enableParallax = () => {
    isParallaxEnabled = true
    bg.classList.remove('fixed')
    bg.style.transform = 'translate3d(0, 0, 0)'

    // Reset initial offset calculation
    initialOffsetTop = null

    window.addEventListener('scroll', updateParallax, { passive: true })

    // Trigger initial calculation
    updateParallax()
  }

  const disableParallax = () => {
    isParallaxEnabled = false
    bg.classList.add('fixed')
    bg.style.transform = 'none'
    window.removeEventListener('scroll', updateParallax)
  }

  const handleResize = () => {
    if (isParallaxEnabled) {
      // Reset offset calculation on resize
      initialOffsetTop = null
      updateParallax()
    }
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
    onBreakpoint('>large', enableParallax)
    onBreakpoint('<=large', disableParallax)
  }

  // Handle window events
  window.addEventListener('load', handleResize)
  window.addEventListener('resize', handleResize)

  // Cleanup function (optional - call this when removing parallax)
  return () => {
    window.removeEventListener('scroll', updateParallax)
    window.removeEventListener('load', handleResize)
    window.removeEventListener('resize', handleResize)
    if (bg.parentNode) {
      bg.parentNode.removeChild(bg)
    }
  }
  //}

  //return applyParallax(0.925) // Reduced intensity
}
