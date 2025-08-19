/**
 * Vanilla JS version of jQuery scrolly plugin (modern browsers only)
 * @param {string} selector - CSS selector for clickable links
 * @param {object} options - { offset: number }
 */
export const scrolly = (selector = 'a[href^="#"]', { offset = 0 } = {}) => {
  document.querySelectorAll(selector).forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href')
      if (!href || !href.startsWith('#')) return

      const target = document.querySelector(href)
      if (!target) return

      e.preventDefault()
      const targetY =
        target.getBoundingClientRect().top + window.scrollY - offset

      window.scrollTo({ top: targetY, behavior: 'smooth' })
    })
  })
}
