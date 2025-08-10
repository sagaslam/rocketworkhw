import { Panel } from './panel.js'
import { initBreakpoints, onBreakpoint } from './breakpointsConfig.js'
//import { scrollex } from './scrollex.js'

export function initNavPanel() {
  const nav = document.querySelector('#nav')
  if (!nav) return

  initBreakpoints()

  // Create nav panel
  const panel = document.createElement('div')
  panel.id = 'navPanel'

  // Nav panel inner <nav> element
  const navPanelInner = document.createElement('nav')
  panel.appendChild(navPanelInner)

  // Cache original nav content (children of #nav)
  const navContent = Array.from(nav.children)

  // Build nav list from existing #nav
  // const navList = buildNavList(nav)
  // if (navList) {
  //   navPanelInner.appendChild(navList)
  // }

  document.body.appendChild(panel)

  // Create panel instance
  const navPanel = new Panel(panel, {
    side: 'right',
    hideOnClick: true,
    hideOnSwipe: true,
    resetScroll: true,
    resetForms: true,
    visibleClass: 'is-navPanel-visible'
  })

  // Create close button
  const closeBtn = document.createElement('a')
  closeBtn.href = '#navPanel'
  closeBtn.className = 'close'

  panel.appendChild(closeBtn)

  document.body.appendChild(panel)

  // Toggle button
  const toggle = document.querySelector('.navPanelToggle') || createToggle()
  toggle.addEventListener('click', (e) => {
    e.preventDefault()
    navPanel.toggle()
  })

  // Move nav content based on breakpoint
  onBreakpoint('>medium', () => {
    navContent.forEach((el) => nav.appendChild(el))
    nav
      .querySelectorAll('.icons, .icon')
      .forEach((icon) => icon.classList.remove('alt'))
  })

  onBreakpoint('<=medium', () => {
    navContent.forEach((el) => navPanelInner.appendChild(el))
    navPanelInner
      .querySelectorAll('.icons, .icon')
      .forEach((icon) => icon.classList.add('alt'))
  })

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault()
    navPanel.hide()
  })

  // Close panel on outside click
  document.addEventListener('click', (event) => {
    const isVisible = navPanel.visibleClass
    if (
      isVisible &&
      !document.querySelector('#navPanel').contains(event.target) &&
      !document.querySelector('#navPanelToggle').contains(event.target)
    ) {
      navPanel.hide()
    }
  })

  // scrollex(document.getElementById('#header'), {
  //   bottom: '5vh',
  //   enter() {
  //     toggle.classList.remove('alt')
  //   },
  //   leave() {
  //     toggle.classList.add('alt')
  //   }
  // })

  // Change toggle styling once we've scrolled past the header.
  // $header.scrollex({
  //   bottom: '5vh',
  //   enter: function () {
  //     $navPanelToggle.removeClass('alt')
  //   },
  //   leave: function () {
  //     $navPanelToggle.addClass('alt')
  //   }
  // })

  setupScrollToggle(
    document.querySelector('header'),
    document.querySelector('#navPanelToggle')
  )

  function setupScrollToggle(headerElement, toggleElement) {
    if (!headerElement || !toggleElement) return

    const threshold = window.innerHeight * 0.05 // 5vh

    window.addEventListener('scroll', () => {
      const headerBottom = headerElement.getBoundingClientRect().bottom

      if (headerBottom <= threshold) {
        toggleElement.classList.add('alt')
      } else {
        toggleElement.classList.remove('alt')
      }
    })
  }

  function createToggle() {
    const t = document.createElement('a')
    t.href = '#navPanel'
    t.id = 'navPanelToggle'
    t.innerHTML = 'Menu'
    document.body.appendChild(t)
    return t
  }
}
