class ContactUsValidator {
  // Private fields (ES6+)
  #form
  #fields = {}
  #errorElements = {}
  #charCount
  #successMessage
  #scriptUrl

  // Validation rules using Map
  #validationRules = new Map([
    [
      'name',
      {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s'-]+$/,
        messages: {
          required: 'Full name is required',
          minLength: 'Name must be at least 2 characters long',
          maxLength: 'Name must be less than 50 characters',
          pattern:
            'Name can only contain letters, spaces, hyphens, and apostrophes'
        }
      }
    ],
    [
      'email',
      {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        messages: {
          required: 'Email address is required',
          pattern: 'Please enter a valid email address'
        }
      }
    ],
    [
      'message',
      {
        required: true,
        minLength: 10,
        maxLength: 500,
        messages: {
          required: 'Message is required',
          minLength: 'Message must be at least 10 characters long',
          maxLength: 'Message must be less than 500 characters'
        }
      }
    ]
  ])

  constructor() {
    this.#scriptUrl = import.meta.env.VITE_GOOGLE_CONTACTUS_URL
    this.#initializeElements()
    this.#bindEvents()
  }

  // Initialize DOM elements using destructuring and modern selectors
  #initializeElements() {
    this.#form = document.querySelector('#contactForm')
    this.#successMessage = document.querySelector('#successMessage')
    this.#charCount = document.querySelector('#charCount')

    // Use destructuring to assign fields and error elements
    const fieldIds = ['name', 'email', 'message']
    fieldIds.forEach((id) => {
      this.#fields[id] = document.querySelector(`#${id}`)
      this.#errorElements[id] = document.querySelector(`#${id}Error`)
    })
  }

  // Bind events using arrow functions and modern event handling
  #bindEvents() {
    this.#form?.addEventListener('submit', this.#handleSubmit)

    // Real-time validation with object destructuring
    Object.entries(this.#fields).forEach(([name, field]) => {
      field?.addEventListener('blur', () => this.#validateField(name))
      field?.addEventListener('input', () => this.#clearValidation(field))
    })

    // Special handling for message field
    this.#fields.message?.addEventListener('input', this.#updateCharCount)
  }

  // Generic field validation using modern syntax
  #validateField = (fieldName) => {
    const field = this.#fields[fieldName]
    const errorElement = this.#errorElements[fieldName]
    const rules = this.#validationRules.get(fieldName)

    if (!field || !rules) return false

    const value = field.value.trim()
    const { required, minLength, maxLength, pattern, messages } = rules

    // Use nullish coalescing operator for default values
    const validationChecks = [
      { condition: required && !value, message: messages.required },
      {
        condition: minLength && value.length > 0 && value.length < minLength,
        message: messages.minLength
      },
      {
        condition: maxLength && value.length > maxLength,
        message: messages.maxLength
      },
      {
        condition: pattern && value && !pattern.test(value),
        message: messages.pattern
      }
    ]

    // Find first failing validation using optional chaining
    const failedCheck = validationChecks.find((check) => check.condition)

    if (failedCheck) {
      this.#showError(field, errorElement, failedCheck.message)
      return false
    }

    this.#showSuccess(field, errorElement)
    return true
  }

  // Update character count with template literals and modern conditional logic
  #updateCharCount = () => {
    const { length } = this.#fields.message.value
    const maxLength = 500

    this.#charCount.textContent = `${length} / ${maxLength}`

    // Use modern conditional assignment
    this.#charCount.className = `char-count ${
      length > 450 ? 'error' : length > 400 ? 'warning' : ''
    }`.trim()
  }

  // Show error using modern DOM manipulation
  #showError = (field, errorElement, message) => {
    field.classList.add('input-error')
    field.classList.remove('input-valid')
    errorElement.textContent = message
    errorElement.classList.add('show')
  }

  // Show success state
  #showSuccess = (field, errorElement) => {
    field.classList.remove('input-error')
    field.classList.add('input-valid')
    errorElement.classList.remove('show')
  }

  // Clear validation state
  #clearValidation = (field) => {
    field.classList.remove('input-error', 'input-valid')
  }

  // Handle form submission with async-like pattern
  #handleSubmit = (e) => {
    e.preventDefault()

    // Validate all fields using array methods
    const validationResults = Object.keys(this.#fields).map((fieldName) => ({
      fieldName,
      isValid: this.#validateField(fieldName)
    }))

    const allValid = validationResults.every(({ isValid }) => isValid)

    if (allValid) {
      this.#submitForm()
    } else {
      // Focus on first invalid field using find method
      const firstInvalidField = validationResults.find(
        ({ isValid }) => !isValid
      )?.fieldName

      this.#fields[firstInvalidField]?.focus()
    }
  }

  // Simulate async form submission using Promises
  #submitForm = async () => {
    const submitBtn = this.#form.querySelector('.submit-btn')
    const originalText = submitBtn.textContent

    // Simulate loading state
    submitBtn.textContent = 'Sending...'
    submitBtn.disabled = true

    // Send POST request with URL-encoded data
    fetch(
      'https://script.google.com/macros/s/AKfycbxj2UiK940T_TAY9IHKxcyJGynrhFQCrerfa3sqS5dUgOZJk_EfzfzQgB_GGroW4H1spg/exec',

      {
        method: 'POST',
        body: this.getFormData1()
      }
    )
      .then((response) => {
        if (response.ok) {
          document.getElementById('responseMessage').textContent =
            'Thank you! Your message has been sent.'
          //this.#resetForm()
        } else {
          throw new Error('Network response was not ok.')
        }
      })
      .catch((error) => {
        document.getElementById('responseMessage').textContent =
          'Error: Your message could not be sent.'
      })
      .finally(() => {
        // Reset button state
        submitBtn.textContent = originalText
        submitBtn.disabled = false
      })

    /*
    try {
      // Simulate API call with Promise
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Reset form and show success
      this.#resetForm()
      this.#showSuccessMessage()
    } catch (error) {
      console.error('Submission failed:', error)

*/
  }

  // Reset form with modern methods
  #resetForm = () => {
    this.#form.reset()
    this.#charCount.textContent = '0 / 500'
    this.#charCount.className = 'char-count'

    // Clear validation states using Object.values
    Object.values(this.#fields).forEach((field) => {
      field.classList.remove('input-error', 'input-valid')
    })
  }

  // Show success message with timeout
  #showSuccessMessage = () => {
    this.#successMessage.classList.add('show')

    // Auto-hide after 5 seconds using arrow function
    setTimeout(() => {
      this.#successMessage.classList.remove('show')
    }, 5000)
  }

  // Public method to manually validate form (if needed)
  validateAll() {
    return Object.keys(this.#fields).every((fieldName) =>
      this.#validateField(fieldName)
    )
  }

  // Public method to get form data as object
  getFormData() {
    return Object.fromEntries(
      Object.entries(this.#fields).map(([name, field]) => [
        name,
        field.value.trim()
      ])
    )
  }

  getFormData1() {
    const data = new URLSearchParams()
    data.append('name', this.#form.name.value)
    data.append('email', this.#form.email.value)
    data.append('message', this.#form.message.value)
    return data
  }
}

// Initialize using modern async DOM loading
//document.addEventListener('DOMContentLoaded', () => {
// const validator = new FormValidator()

// Make validator available globally for debugging (optional)
//window.formValidator = validator
//})

export default ContactUsValidator
