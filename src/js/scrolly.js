/**
 * Vanilla JS version of jQuery scrolly plugin
 * @param {string} selector - CSS selector for clickable links
 * @param {object} options - { offset: number, speed: number }
 */
export function scrolly(selector = 'a[href^="#"]', options = {}) {
  const offset = options.offset || 0
  const speed = options.speed || 500

  const links = document.querySelectorAll(selector)

  links.forEach((link) => {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href')
      if (!href || !href.startsWith('#')) return

      const target = document.querySelector(href)
      if (!target) return

      e.preventDefault()

      const startY = window.scrollY || window.pageYOffset
      const targetY = target.getBoundingClientRect().top + startY - offset

      const startTime = performance.now()

      function scrollStep(currentTime) {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / speed, 1)
        const ease = 0.5 * (1 - Math.cos(Math.PI * progress)) // easeInOut
        window.scrollTo(0, startY + (targetY - startY) * ease)

        if (progress < 1) {
          requestAnimationFrame(scrollStep)
        }
      }

      requestAnimationFrame(scrollStep)
    })
  })
}
