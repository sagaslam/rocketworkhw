// parallax.js

import { initBreakpoints } from '@js/breakpointsConfig.js'
import browser from '@js/browser.min.js'
import '@js/jquery.min.js'

export function initParallax(wrapper) {
  const $window = $(window)
  const $wrapper = $(wrapper)

  initBreakpoints()

  $.fn._parallax = function (intensity = 0.25) {
    if ($wrapper.length === 0 || intensity === 0) return $wrapper
    if ($wrapper.length > 1) {
      $wrapper.each(function () {
        $($wrapper)._parallax(intensity)
      })
      return $wrapper
    }

    return $wrapper.each(function () {
      const $el = $(wrapper)
      const $bg = $('<div class="bg"></div>').appendTo($el)

      const on = () => {
        $bg.removeClass('fixed').css('transform', 'matrix(1,0,0,1,0,0)')
        $window.on('scroll._parallax', () => {
          const pos =
            parseInt($window.scrollTop()) - parseInt($el.position().top)
          $bg.css('transform', `matrix(1,0,0,1,0,${pos * intensity})`)
        })
      }

      const off = () => {
        $bg.addClass('fixed').css('transform', 'none')
        $window.off('scroll._parallax')
      }

      if (
        browser.name === 'ie' ||
        browser.name === 'edge' ||
        window.devicePixelRatio > 1 ||
        browser.mobile
      ) {
        off()
      } else {
        breakpoint.on('>large', on)
        breakpoint.on('<=large', off)
      }

      $window
        .off('load._parallax resize._parallax')
        .on('load._parallax resize._parallax', () => {
          $window.trigger('scroll')
        })
    })
  }

  $wrapper._parallax(0.925)
}
