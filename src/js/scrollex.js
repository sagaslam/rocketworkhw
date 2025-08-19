// scrollex.js

const activeObservers = new WeakMap()

const normalizeElements = (targets) => {
  if (typeof targets === 'string')
    return [...document.querySelectorAll(targets)]
  if (targets instanceof Element) return [targets]
  return [...targets]
}

const toRootMargin = (val) => {
  if (typeof val === 'number') return `${val}px`
  if (typeof val === 'string') {
    if (val.endsWith('px') || val.endsWith('%')) return val
    if (val.endsWith('vh')) {
      const num = parseFloat(val)
      const px = (window.innerHeight * num) / 100
      return `${px}px`
    }
  }
  return '0px'
}

/**
 * Vanilla JS Scrollex with resize, auto-cleanup, and threshold support
 */
export function scrollex(targets, options = {}) {
  const {
    mode = 'middle',
    top = '0px',
    bottom = '0px',
    enter = () => {},
    leave = () => {},
    scroll = () => {},
    threshold = 0
  } = options

  const elements = normalizeElements(targets)

  const buildObservers = () => {
    elements.forEach((el) => {
      if (activeObservers.has(el)) {
        activeObservers.get(el).disconnect()
        activeObservers.delete(el)
      }

      let isInView = false

      const marginTop = toRootMargin(top)
      const marginBottom = toRootMargin(bottom)

      let rootMargin = '0px 0px 0px 0px'
      if (mode === 'middle') rootMargin = `${marginTop} 0px ${marginBottom} 0px`
      else if (mode === 'top') rootMargin = `${marginTop} 0px -100% 0px`
      else if (mode === 'bottom') rootMargin = `-100% 0px ${marginBottom} 0px`

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            scroll(entry)

            if (entry.isIntersecting && !isInView) {
              isInView = true
              enter(entry)
            } else if (!entry.isIntersecting && isInView) {
              isInView = false
              leave(entry)
            }
          })
        },
        { root: null, rootMargin, threshold }
      )

      observer.observe(el)
      activeObservers.set(el, observer)
    })
  }

  buildObservers()

  const resizeHandler = () => buildObservers()
  window.addEventListener('resize', resizeHandler)

  return () => {
    window.removeEventListener('resize', resizeHandler)
    unscrollex(elements)
  }
}

export function unscrollex(targets) {
  const elements = normalizeElements(targets)
  elements.forEach((el) => {
    if (activeObservers.has(el)) {
      activeObservers.get(el).disconnect()
      activeObservers.delete(el)
    }
  })
}
