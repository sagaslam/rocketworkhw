/**
 * Vanilla JS replacement for jQuery scrollex
 * @param {string|Element|NodeList} targets - Selector or elements to watch
 * @param {object} options
 *  - mode: 'top' | 'middle' | 'bottom' (default: 'middle')
 *  - top: number|string (e.g., '30vh' or 100)
 *  - bottom: number|string
 *  - enter: () => {}
 *  - leave: () => {}
 *  - scroll: () => {}
 */
export function scrollex(targets, options = {}) {
  const {
    mode = 'middle',
    top = '0px',
    bottom = '0px',
    enter = () => {},
    leave = () => {},
    scroll = () => {}
  } = options

  // Normalize input
  const elements =
    typeof targets === 'string'
      ? document.querySelectorAll(targets)
      : targets instanceof Element
      ? [targets]
      : targets

  elements.forEach((el) => {
    let isInView = false

    // Determine rootMargin based on mode and top/bottom
    const marginTop = typeof top === 'string' ? top : `${top}px`
    const marginBottom = typeof bottom === 'string' ? bottom : `${bottom}px`

    let rootMargin = '0px 0px 0px 0px'
    if (mode === 'middle') {
      rootMargin = `${marginTop} 0px ${marginBottom} 0px`
    } else if (mode === 'top') {
      rootMargin = `${marginTop} 0px -100% 0px`
    } else if (mode === 'bottom') {
      rootMargin = `-100% 0px ${marginBottom} 0px`
    }

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
      {
        root: null,
        rootMargin,
        threshold: 0
      }
    )

    observer.observe(el)
  })
}
