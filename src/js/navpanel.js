import { Panel } from './panel.js'
import { buildNavList } from './navlist.js'

export function initNavPanel() {
  const nav = document.querySelector('#nav')
  if (!nav) return

  // Build nav list from existing #nav
  const navList = buildNavList(nav)

  const panel = document.createElement('div')
  panel.id = 'navPanel'

  if (navList) {
    panel.appendChild(navList)
  }

  document.body.appendChild(panel)

  const toggle = document.querySelector('.navPanelToggle') || createToggle()
  toggle.addEventListener('click', (e) => {
    e.preventDefault()
    navPanel.toggle()
  })

  const navPanel = new Panel(panel, {
    side: 'left',
    hideOnClick: true,
    hideOnSwipe: true,
    resetScroll: true,
    resetForms: true
  })

  function createToggle() {
    const t = document.createElement('a')
    t.href = '#navPanel'
    t.className = 'navPanelToggle'
    t.innerHTML = '<span class="label">Menu</span>'
    document.body.appendChild(t)
    return t
  }
}

// // navPanel.js
// import { navList } from '@js/navList.js'
// import { Panel } from '@js/panel.js'

// export function initNavPanel({
//   navSelector = '#nav',
//   panelId = 'navPanel',
//   visibleClass = 'is-navPanel-visible',
//   delay = 500
// } = {}) {
//   const body = document.body
//   const nav = document.querySelector(navSelector)
//   if (!nav) return

//   // Convert nav to list (flatten <ul>/<li>)
//   const navList1 = convertNavToList(nav)
//   const flattenedNavHTML = navList(document.querySelector('#nav'))

//   // Create panel
//   // const panel = document.createElement('div')
//   // panel.id = panelId
//   // panel.innerHTML = `
//   //   <nav>${navList}</nav>
//   //   <a href="#${panelId}" class="close"></a>
//   // `
//   // body.appendChild(panel)

//   const panel = new Panel('#navPanel', {
//     delay: 500,
//     hideOnClick: true,
//     hideOnSwipe: true,
//     resetScroll: true,
//     resetForms: true,
//     side: 'left',
//     target: document.body,
//     visibleClass: 'is-navPanel-visible'
//   })

//   // Toggle visibility
//   const showPanel = () => {
//     body.classList.add(visibleClass)
//   }

//   const hidePanel = () => {
//     body.classList.remove(visibleClass)
//   }

//   // Event: Close link
//   panel.querySelector('.close')?.addEventListener('click', (e) => {
//     e.preventDefault()
//     hidePanel()
//   })

//   // Event: Click outside to close
//   panel.addEventListener('click', (e) => {
//     if (e.target === panel) hidePanel()
//   })

//   // Event: Swipe to close (basic left swipe)
//   let touchStartX = null
//   panel.addEventListener('touchstart', (e) => {
//     touchStartX = e.touches[0].clientX
//   })

//   panel.addEventListener('touchmove', (e) => {
//     if (touchStartX !== null) {
//       const diffX = touchStartX - e.touches[0].clientX
//       if (diffX > 50) hidePanel() // swipe left
//     }
//   })

//   // Optional: Reset scroll/forms
//   const resetPanel = () => {
//     panel.scrollTop = 0
//     panel.querySelectorAll('form').forEach((form) => form.reset())
//   }

//   // Hide on nav link click
//   panel.querySelectorAll('a').forEach((link) => {
//     link.addEventListener('click', (e) => {
//       const href = link.getAttribute('href')
//       if (!href || href === '#' || href === `#${panelId}`) return
//       hidePanel()
//       setTimeout(() => {
//         window.location.href = href
//       }, delay)
//     })
//   })

//   // Optional trigger (e.g., a menu button)
//   const toggleTrigger = document.querySelector('[data-toggle="navPanel"]')
//   if (toggleTrigger) {
//     toggleTrigger.addEventListener('click', (e) => {
//       e.preventDefault()
//       body.classList.toggle(visibleClass)
//     })
//   }

//   return { showPanel, hidePanel }
// }

// // Helper to flatten nav into a basic list
// function convertNavToList(nav) {
//   const items = nav.querySelectorAll('a')
//   return Array.from(items)
//     .map((link) => {
//       const href = link.getAttribute('href')
//       const text = link.textContent
//       return `<a href="${href}">${text}</a>`
//     })
//     .join('')
// }

// // import { initNavPanel } from './navPanel.js';

// // initNavPanel({
// //   navSelector: '#nav',
// //   panelId: 'navPanel',
// //   visibleClass: 'is-navPanel-visible',
// // });

// // <a href="#navPanel" class="toggle" data-toggle="navPanel">☰</a>
