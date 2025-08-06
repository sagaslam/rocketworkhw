// prioritize.js

const PRIORITIZE_DATA_KEY = '__prioritize_placeholder'

/**
 * Moves elements to the first position in their parent if condition is true,
 * else restores them to their original position.
 * @param {HTMLElement[]|NodeList|HTMLElement} elements - Elements or selector to prioritize.
 * @param {boolean} condition - Whether to prioritize (true) or revert (false).
 */
export function prioritize(elements, condition) {
  // Normalize elements to array of HTMLElements
  if (!elements) return
  if (typeof elements === 'string') {
    elements = document.querySelectorAll(elements)
  }
  if (elements instanceof HTMLElement) {
    elements = [elements]
  }
  elements = Array.from(elements)

  elements.forEach((el) => {
    const parent = el.parentNode
    if (!parent) return

    const placeholder = el.__prioritize_placeholder

    if (condition) {
      // Move to top if not already moved
      if (!placeholder) {
        // Create a placeholder marker (comment node) before el
        const marker = document.createComment('prioritize-placeholder')
        parent.insertBefore(marker, el)
        el.__prioritize_placeholder = marker

        // Move element to the first child of parent
        parent.insertBefore(el, parent.firstChild)
      }
    } else {
      // Restore to original position if moved
      if (placeholder) {
        parent.insertBefore(el, placeholder.nextSibling)
        placeholder.remove()
        delete el.__prioritize_placeholder
      }
    }
  })
}

// import { prioritize } from './prioritize.js';

// // Example: prioritize elements with class '.important' on condition
// const importantElems = document.querySelectorAll('.important');
// const isMobile = window.matchMedia('(max-width: 768px)').matches;

// prioritize(importantElems, isMobile);
