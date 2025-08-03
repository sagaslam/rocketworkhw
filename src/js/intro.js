// intro.js

import { initBreakpoints, onBreakpoint } from './breakpointsConfig.js'
import browser from '@js/browser.min.js'
import '@js/jquery.min.js'
import '@js/breakpoints.min.js'

export function initIntro(main) {
  const $window = $(window)
  const $intro = $('#intro')
  const $main = $(main)

  initBreakpoints()

  if ($intro.length === 0) return

  if (browser.name === 'ie') {
    $window
      .on('resize.ie-intro-fix', () => {
        const h = $intro.height()
        $intro.css('height', h > $window.height() ? 'auto' : h)
      })
      .trigger('resize.ie-intro-fix')
  }

  onBreakpoint('>small', () => {
    $main.unscrollex()
    $main.scrollex({
      mode: 'bottom',
      top: '25vh',
      bottom: '-50vh',
      enter: () => $intro.addClass('hidden'),
      leave: () => $intro.removeClass('hidden')
    })
  })

  onBreakpoint('<=small', () => {
    $main.unscrollex()
    $main.scrollex({
      mode: 'middle',
      top: '15vh',
      bottom: '-15vh',
      enter: () => $intro.addClass('hidden'),
      leave: () => $intro.removeClass('hidden')
    })
  })
}
