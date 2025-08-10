// nav.js
import { initBreakpoints, onBreakpoint } from './breakpointsConfig.js'
//import browser from '@js/browser.min.js'
//import '@js/jquery.min.js'

export function initNav() {
  //const $window = $(window)
  const $body = $('body')
  const $wrapper = $('#wrapper')
  const $header = $('#header')
  const $nav = $('#nav')

  initBreakpoints()

  // Create toggle button and append to wrapper
  const $navPanelToggle = $(
    '<a href="#navPanel" id="navPanelToggle">Menu</a>'
  ).appendTo($wrapper)

  // Change toggle styling once we've scrolled past the header
  $header.scrollex({
    bottom: '5vh',
    enter: () => $navPanelToggle.removeClass('alt'),
    leave: () => $navPanelToggle.addClass('alt')
  })

  // Create nav panel and append to body
  const $navPanel = $(
    `<div id="navPanel">
      <nav></nav>
      <a href="#navPanel" class="close"></a>
    </div>`
  ).appendTo($body)

  // Initialize panel plugin on navPanel
  $navPanel.panel({
    delay: 500,
    hideOnClick: true,
    hideOnSwipe: true,
    resetScroll: true,
    resetForms: true,
    side: 'right',
    target: $body,
    visibleClass: 'is-navPanel-visible'
  })

  // Nav panel inner nav element
  const $navPanelInner = $navPanel.children('nav')

  // Cache nav content to move between nav and navPanelInner
  const $navContent = $nav.children()

  // Move nav content based on breakpoint
  onBreakpoint('>medium', () => {
    $navContent.appendTo($nav)
    $nav.find('.icons, .icon').removeClass('alt')
  })

  onBreakpoint('<=medium', () => {
    $navContent.appendTo($navPanelInner)
    $navPanelInner.find('.icons, .icon').addClass('alt')
  })
}
