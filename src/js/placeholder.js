// placeholder.js

export function initPlaceholders(container = document.body) {
  if ('placeholder' in document.createElement('input')) return // Browser supports it

  const inputs = container.querySelectorAll(
    'input[placeholder], textarea[placeholder]'
  )

  inputs.forEach((el) => {
    const placeholder = el.getAttribute('placeholder')

    // Skip password fields
    if (el.type === 'password') return

    const handleFocus = () => {
      if (el.value === placeholder) {
        el.classList.remove('placeholder')
        el.value = ''
      }
    }

    const handleBlur = () => {
      if (el.value.trim() === '') {
        el.classList.add('placeholder')
        el.value = placeholder
      }
    }

    el.addEventListener('focus', handleFocus)
    el.addEventListener('blur', handleBlur)

    // Trigger blur initially to set placeholder
    handleBlur()

    // Optional: prevent form submission of fake values
    el.form?.addEventListener('submit', () => {
      if (el.value === placeholder) {
        el.value = ''
      }
    })
  })
}

// import { initPlaceholders } from './placeholder.js';

// // On DOM ready or window load
// document.addEventListener('DOMContentLoaded', () => {
//   initPlaceholders(); // Or pass a specific container element
// });
