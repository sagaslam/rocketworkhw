class JoinUsValidator {
  // Private fields (ES6+)
  #form
  #fields = {}
  #errorElements = {}
  #successMessage
  #submitBtn

  SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_URL_HERE/exec'

  // Validation rules using Map for HW Rocket Works form
  #validationRules = new Map([
    [
      'name',
      {
        required: true,
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-Z\s'-]+$/,
        messages: {
          required: 'Full name is required',
          minLength: 'Name must be at least 2 characters long',
          maxLength: 'Name must be less than 100 characters',
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
      'year',
      {
        required: true,
        messages: {
          required: 'Please select your year/stage'
        }
      }
    ],
    [
      'discipline',
      {
        required: true,
        minLength: 2,
        maxLength: 200,
        messages: {
          required: 'Discipline is required',
          minLength: 'Discipline must be at least 2 characters long',
          maxLength: 'Discipline must be less than 200 characters'
        }
      }
    ],
    [
      'positions',
      {
        type: 'checkbox',
        required: true,
        minChecked: 1,
        maxChecked: 7,
        selector: 'input[name="positions"]',
        containerSelector: '.checkbox-group',
        messages: {
          required: "Please select at least one position you're interested in",
          minChecked: 'Please select at least 1 position',
          maxChecked: 'Please select no more than 7 positions'
        }
      }
    ],
    [
      'whyJoin',
      {
        required: true,
        minLength: 20,
        maxLength: 1000,
        messages: {
          required: 'Please explain why you want to join',
          minLength: 'Please provide at least 20 characters',
          maxLength: 'Response must be less than 1000 characters'
        }
      }
    ],
    [
      'experience',
      {
        required: true,
        minLength: 20,
        maxLength: 1000,
        messages: {
          required: 'Please describe your experience and skills',
          minLength: 'Please provide at least 20 characters',
          maxLength: 'Response must be less than 1000 characters'
        }
      }
    ],
    [
      'additionalInfo',
      {
        required: false,
        maxLength: 500,
        messages: {
          maxLength: 'Additional information must be less than 500 characters'
        }
      }
    ],
    [
      'adjustments',
      {
        required: false,
        maxLength: 500,
        messages: {
          maxLength: 'Adjustments information must be less than 500 characters'
        }
      }
    ]
  ])

  constructor() {
    this.#initializeElements()
    this.#bindEvents()
  }

  // Initialize DOM elements using modern selectors
  #initializeElements() {
    this.#form = document.querySelector('#joinusForm')
    this.#successMessage = document.querySelector('#successMessage')
    this.#submitBtn = this.#form?.querySelector('.submit-btn')

    // Initialize form fields (exclude checkbox groups as they're handled separately)
    const fieldIds = [
      'fullName',
      'email',
      'year',
      'discipline',
      'whyJoin',
      'experience',
      'additionalInfo',
      'adjustments'
    ]
    fieldIds.forEach((id) => {
      this.#fields[id] = document.querySelector(`#${id}`)
    })
  }

  // Bind events using arrow functions and modern event handling
  #bindEvents() {
    this.#form?.addEventListener('submit', this.#handleSubmit)

    // Real-time validation
    Object.entries(this.#fields).forEach(([name, field]) => {
      field?.addEventListener('blur', () => this.#validateField(name))
      field?.addEventListener('input', () => this.#clearFieldError(field))
    })
    // Add change events for checkbox groups
    this.#bindCheckboxEvents()
  }

  #bindCheckboxEvents() {
    // Get all checkbox validation rules
    const checkboxRules = Array.from(this.#validationRules.entries()).filter(
      ([_, rules]) => rules.type === 'checkbox'
    )

    checkboxRules.forEach(([fieldName, rules]) => {
      const checkboxes = document.querySelectorAll(rules.selector)
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () =>
          this.#validateField(fieldName)
        )
      })
    })
  }

  // Generic field validation using modern syntax
  #validateField = (fieldName) => {
    const rules = this.#validationRules.get(fieldName)
    if (!rules) return true

    // Handle checkbox validation separately
    if (rules.type === 'checkbox') {
      return this.#validateCheckboxGroup(fieldName, rules)
    }

    // Handle regular field validation
    const field = this.#fields[fieldName]
    if (!field) return true

    const value = field.value.trim()
    const { required, minLength, maxLength, pattern, messages } = rules

    // Validation checks
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

    // Find first failing validation
    const failedCheck = validationChecks.find((check) => check.condition)

    if (failedCheck) {
      this.#showFieldError(field, failedCheck.message)
      return false
    }

    this.#showFieldSuccess(field)
    return true
  }

  // Generic checkbox group validation
  #validateCheckboxGroup = (fieldName, rules) => {
    const {
      required,
      minChecked = 1,
      maxChecked,
      selector,
      containerSelector,
      messages
    } = rules

    // Get checked checkboxes using the provided selector
    const checkedBoxes = document.querySelectorAll(`${selector}:checked`)
    const checkedCount = checkedBoxes.length

    let errorMessage = null

    // Validation logic
    if (required && checkedCount === 0) {
      errorMessage =
        messages.required ||
        messages.minChecked ||
        `Please select at least ${minChecked} option(s)`
    } else if (minChecked && checkedCount < minChecked) {
      errorMessage =
        messages.minChecked || `Please select at least ${minChecked} option(s)`
    } else if (maxChecked && checkedCount > maxChecked) {
      errorMessage =
        messages.maxChecked ||
        `Please select no more than ${maxChecked} option(s)`
    }

    // Handle error display
    const container = containerSelector
      ? document.querySelector(containerSelector)
      : null

    if (errorMessage) {
      this.#showCheckboxError(container, errorMessage)
      return false
    } else {
      this.#showCheckboxSuccess(container)
      return true
    }
  }

  // Show checkbox group error
  #showCheckboxError = (container, message) => {
    if (container) {
      container.classList.add('error')

      // Create or update error element
      let errorElement =
        container.querySelector('.checkbox-error') ||
        container.parentNode.querySelector('.checkbox-error')

      if (!errorElement) {
        errorElement = document.createElement('div')
        errorElement.className = 'checkbox-error field-error'
        container.parentNode.insertBefore(errorElement, container.nextSibling)
      }

      errorElement.textContent = message
      errorElement.style.display = 'block'
    }
  }

  // Show checkbox group success
  #showCheckboxSuccess = (container) => {
    if (container) {
      container.classList.remove('error')

      const errorElement =
        container.querySelector('.checkbox-error') ||
        container.parentNode.querySelector('.checkbox-error')
      if (errorElement) {
        errorElement.style.display = 'none'
      }
    }
  }

  // Show field-specific error
  #showFieldError = (field, message) => {
    field.classList.add('input-error')
    field.classList.remove('input-valid')

    // Create or update error element
    let errorElement = field.parentNode.querySelector('.field-error')
    if (!errorElement) {
      errorElement = document.createElement('div')
      errorElement.className = 'field-error'
      field.parentNode.appendChild(errorElement)
    }
    errorElement.textContent = message
    errorElement.style.display = 'block'
  }

  // Show field success state
  #showFieldSuccess = (field) => {
    field.classList.remove('input-error')
    field.classList.add('input-valid')

    const errorElement = field.parentNode.querySelector('.field-error')
    if (errorElement) {
      errorElement.style.display = 'none'
    }
  }

  // Clear field validation state
  #clearFieldError = (field) => {
    field.classList.remove('input-error', 'input-valid')
    const errorElement = field.parentNode.querySelector('.field-error')
    if (errorElement) {
      errorElement.style.display = 'none'
    }
  }

  // Show general error message
  #showError = (message) => {
    alert(message) // Can be replaced with a custom error display
  }

  // Handle form submission
  #handleSubmit = (e) => {
    e.preventDefault()

    // Validate all fields including checkboxes
    const allFieldNames = Array.from(this.#validationRules.keys())
    const validationResults = allFieldNames.map((fieldName) => ({
      fieldName,
      isValid: this.#validateField(fieldName)
    }))

    const allValid = validationResults.every(({ isValid }) => isValid)

    if (allValid) {
      this.#submitForm()
    } else {
      // Focus on first invalid field (skip checkbox groups)
      const firstInvalidField = validationResults.find(
        ({ isValid, fieldName }) => !isValid && this.#fields[fieldName]
      )?.fieldName

      if (firstInvalidField && this.#fields[firstInvalidField]) {
        this.#fields[firstInvalidField].focus()
      }
    }
  }

  // Submit form with async handling
  #submitForm = async () => {
    const originalText = this.#submitBtn.textContent

    // Show loading state
    this.#submitBtn.textContent = 'Submitting...'
    this.#submitBtn.disabled = true

    try {
      // Simulate form submission - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Get form data for logging/processing
      const formData = this.getFormData()
      console.log('Form submitted with data:', formData)

      // Show success and reset form
      this.#showSuccessMessage()
      this.#resetForm()
    } catch (error) {
      console.error('Submission failed:', error)
      this.#showError('Submission failed. Please try again.')
    } finally {
      // Reset button state
      this.#submitBtn.textContent = originalText
      this.#submitBtn.disabled = false
    }
  }

  // Reset form with modern methods
  #resetForm = () => {
    this.#form.reset()

    // Clear validation states
    Object.values(this.#fields).forEach((field) => {
      field.classList.remove('input-error', 'input-valid')
      const errorElement = field.parentNode.querySelector('.field-error')
      if (errorElement) {
        errorElement.style.display = 'none'
      }
    })

    // Clear checkbox validation
    document.querySelector('.checkbox-group')?.classList.remove('error')
  }

  // Show success message with timeout
  #showSuccessMessage = () => {
    this.#successMessage.style.display = 'block'

    // Scroll to show success message
    document
      .querySelector('.form-container')
      .scrollIntoView({ behavior: 'smooth' })

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.#successMessage.style.display = 'none'
    }, 5000)
  }

  // Public method to manually validate form
  validateAll() {
    const allFieldNames = Array.from(this.#validationRules.keys())
    return allFieldNames.every((fieldName) => this.#validateField(fieldName))
  }

  // Public method to get form data as object
  getFormData() {
    const data = Object.fromEntries(
      Object.entries(this.#fields).map(([name, field]) => [
        name,
        field.value.trim()
      ])
    )

    // Add checkbox group data
    const checkboxRules = Array.from(this.#validationRules.entries()).filter(
      ([_, rules]) => rules.type === 'checkbox'
    )

    checkboxRules.forEach(([fieldName, rules]) => {
      const checkedBoxes = document.querySelectorAll(
        `${rules.selector}:checked`
      )
      data[fieldName] = Array.from(checkedBoxes).map((cb) => cb.value)
    })

    return data
  }

  // Get form data for URL encoding (if needed for API submission)
  getFormDataEncoded() {
    const data = new URLSearchParams()
    const formData = this.getFormData()

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        data.append(key, value.join(', '))
      } else {
        data.append(key, value)
      }
    })

    return data
  }
}

// Additional CSS for error states
const errorStyles = `
            .input-error {
                border-color: #e74c3c !important;
                box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
            }
            
            .input-valid {
                border-color: #27ae60 !important;
                box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1) !important;
            }
            
            .field-error {
                color: #e74c3c;
                font-size: 14px;
                margin-top: 5px;
                display: none;
            }
            
            .checkbox-group.error {
                border: 2px solid #e74c3c;
                border-radius: 10px;
                padding: 15px;
                margin-top: 10px;
            }
        `

// Inject error styles
const styleSheet = document.createElement('style')
styleSheet.textContent = errorStyles
document.head.appendChild(styleSheet)

// Initialize validator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  //const validator = new JoinUsValidator()

  // Make validator available globally for debugging (optional)
  window.JoinUsValidator = new JoinUsValidator()
})

// Add hover effects to checkbox items
// document.querySelectorAll('.checkbox-item').forEach((item) => {
//   item.addEventListener('click', function () {
//     const checkbox = this.querySelector('input[type="checkbox"]')
//     if (checkbox) {
//       checkbox.checked = !checkbox.checked
//     }
//   })
// })

// Prevent double-clicking on checkboxes
document
  .querySelectorAll('.checkbox-item input[type="checkbox"]')
  .forEach((checkbox) => {
    checkbox.addEventListener('click', function (e) {
      e.stopPropagation()
    })
  })
