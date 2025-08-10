// panel.js

export class Panel {
  constructor(
    element,
    {
      delay = 500,
      hideOnClick = false,
      hideOnSwipe = false,
      resetScroll = false,
      resetForms = false,
      side = 'right',
      target = document.body,
      visibleClass = 'is-navPanel-visible'
    } = {}
  ) {
    this.panel =
      typeof element === 'string' ? document.querySelector(element) : element
    this.delay = delay
    this.hideOnClick = hideOnClick
    this.hideOnSwipe = hideOnSwipe
    this.resetScroll = resetScroll
    this.resetForms = resetForms
    this.side = side
    this.target = target
    this.visibleClass = visibleClass

    if (!this.panel) return

    this._init()
  }

  _init() {
    this.panel.setAttribute('aria-hidden', 'true')
    //this.panel.classList.add('panel', this.side)

    // Hide on outside clicks
    if (this.hideOnClick) {
      this.panel.addEventListener('click', (e) => {
        if (e.target === this.panel) {
          this.hide()
        }
      })

      // Hide on any link click
      this.panel.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href')
          if (!href || href === '#' || href === '') return
          this.hide()
          setTimeout(() => {
            window.location.href = href
          }, this.delay)
        })
      })
    }

    // Hide on swipe (simple left swipe)
    if (this.hideOnSwipe) {
      let touchStartX = null

      this.panel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX
      })

      this.panel.addEventListener('touchmove', (e) => {
        if (touchStartX === null) return

        const diffX = touchStartX - e.touches[0].clientX
        if (diffX > 50) {
          touchStartX = null
          this.hide()
        }
      })
    }
  }

  show() {
    this.panel.setAttribute('aria-hidden', '')
    this.target.classList.add(this.visibleClass)
  }

  hide() {
    this.panel.setAttribute('aria-hidden', 'true')
    this.target.classList.remove(this.visibleClass)

    if (this.resetScroll) {
      this.panel.scrollTop = 0
    }

    if (this.resetForms) {
      this.panel.querySelectorAll('form').forEach((form) => form.reset())
    }
  }

  toggle() {
    const isVisible = this.target.classList.contains(this.visibleClass)
    if (isVisible) {
      this.hide()
    } else {
      this.show()
    }
  }
}

//  Example Usage (in navPanel.js or main.js)
// import { Panel } from './panel.js';

// const navPanel = new Panel('#navPanel', {
//   delay: 500,
//   hideOnClick: true,
//   hideOnSwipe: true,
//   resetScroll: true,
//   resetForms: true,
//   side: 'left',
//   target: document.body,
//   visibleClass: 'is-navPanel-visible',
// });

// // Optional: toggle with button
// document.querySelector('[data-toggle="navPanel"]')?.addEventListener('click', (e) => {
//   e.preventDefault();
//   navPanel.toggle();
// });
