// intro.js

import { initBreakpoints, onBreakpoint } from './breakpointsConfig.js'
//import browser from '@js/browser.min.js'
//import '@js/jquery.min.js'
import '@js/breakpoints.min.js'
import { scrollex } from '@js/scrollex.js'

export function initIntro(main) {
  //const window = window
  const intro = document.querySelector('#intro')
  //const main = document.querySelector('#main')
  initBreakpoints()

  // If there's no intro section, bail out
  if (!intro) return

  // IE-specific fix (only if browser is IE — optional detection)
  if (navigator.userAgent.includes('Trident')) {
    const handleResize = () => {
      const introHeight = intro.offsetHeight
      const windowHeight = window.innerHeight
      intro.style.height =
        introHeight > windowHeight ? 'auto' : `${introHeight}px`
    }

    window.addEventListener('resize', handleResize)

    // Trigger once immediately
    handleResize()
  }

  onBreakpoint('>small', () => {
    // Remove existing observer by replacing the element (cheap cleanup)
    const newMain = document.querySelector('#main').cloneNode(true)
    const intro = document.querySelector('#intro')

    scrollex('newMain', {
      mode: 'middle',
      top: '25vh',
      bottom: '-50vh',
      enter: () => intro.classList.add('hidden'),
      leave: () => intro.classList.remove('hidden')
    })
  })

  onBreakpoint('<=small', () => {
    // Remove existing observer by replacing the element (cheap cleanup)
    const newMain = document.querySelector('#main').cloneNode(true)
    const intro = document.querySelector('#intro')

    scrollex('newMain', {
      mode: 'middle',
      top: '15vh',
      bottom: '-15vh',
      enter: () => intro.classList.add('hidden'),
      leave: () => intro.classList.remove('hidden')
    })
  })

  // onBreakpoint('>small', () => {
  //   $main.unscrollex()
  //   $main.scrollex({
  //     mode: 'bottom',
  //     top: '25vh',
  //     bottom: '-50vh',
  //     enter: () => $intro.addClass('hidden'),
  //     leave: () => $intro.removeClass('hidden')
  //   })
  // })

  // onBreakpoint('<=small', () => {
  //   $main.unscrollex()
  //   $main.scrollex({
  //     mode: 'middle',
  //     top: '15vh',
  //     bottom: '-15vh',
  //     enter: () => $intro.addClass('hidden'),
  //     leave: () => $intro.removeClass('hidden')
  //   })
  // })
}
