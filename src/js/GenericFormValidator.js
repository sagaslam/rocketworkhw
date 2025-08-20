// ================================
// GENERIC FORM VALIDATOR BASE CLASS
// ================================

export default class GenericFormValidator {
  // Private fields that any form validator needs
  #form
  #fields = {}
  #errorElements = {}
  #successMessage
  #submitBtn
  #validationRules = new Map()

  constructor(formSelector, validationRules = new Map()) {
    this.#validationRules = validationRules
    this.#initializeElements(formSelector)
    this.#bindEvents()
  }

  // Generic DOM element initialization
  #initializeElements(formSelector) {
    this.#form = document.querySelector(formSelector)
    this.#successMessage = document.querySelector('#responseMessage')
    this.#submitBtn = this.#form?.querySelector('.submit-btn')

    // Initialize fields based on validation rules
    this.#validationRules.forEach((rules, fieldName) => {
      if (rules.type !== 'checkbox') {
        // Map common field name patterns to actual IDs
        const fieldId = this.mapFieldNameToId(fieldName)
        this.#fields[fieldName] = document.querySelector(`#${fieldId}`)
      }
    })
  }

  // Override this method in specific implementations for custom field ID mapping
  mapFieldNameToId(fieldName) {
    // Default mapping - can be overridden
    return fieldName
  }

  // Generic event binding
  #bindEvents() {
    this.#form?.addEventListener('submit', this.#handleSubmit)

    // Real-time validation for regular fields
    Object.entries(this.#fields).forEach(([name, field]) => {
      field?.addEventListener('blur', () => this.#validateField(name))
      field?.addEventListener('input', () => this.#clearFieldError(field))
    })

    // Bind checkbox events
    this.#bindCheckboxEvents()
  }

  // Generic checkbox event binding
  #bindCheckboxEvents() {
    const checkboxRules = Array.from(this.#validationRules.entries()).filter(
      ([_, rules]) => rules.type === 'checkbox'
    )

    checkboxRules.forEach(([fieldName, rules]) => {
      const checkboxes = document.querySelectorAll(rules.selector)

      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
          this.#validateField(fieldName)
        })

        checkbox.addEventListener('click', (e) => {
          e.stopPropagation()
        })
      })
    })

    // checkboxRules.forEach(([fieldName, rules]) => {
    //   const checkboxes = document.querySelectorAll(rules.selector)
    //   checkboxes.forEach((checkbox) => {
    //     checkbox.addEventListener('change', () =>
    //       this.#validateField(fieldName)
    //     )
    //   })
    // })
  }

  // Generic field validation
  #validateField = (fieldName) => {
    const rules = this.#validationRules.get(fieldName)
    if (!rules) return true

    if (rules.type === 'checkbox') {
      return this.#validateCheckboxGroup(fieldName, rules)
    }

    const field = this.#fields[fieldName]
    if (!field) return true

    const value = field.value.trim()
    const { required, minLength, maxLength, pattern, messages } = rules

    // Generic validation checks
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

    const checkedBoxes = document.querySelectorAll(`${selector}:checked`)
    const checkedCount = checkedBoxes.length

    let errorMessage = null

    if (required && checkedCount === 0) {
      errorMessage =
        messages.required || `Please select at least ${minChecked} option(s)`
    } else if (minChecked && checkedCount < minChecked) {
      errorMessage =
        messages.minChecked || `Please select at least ${minChecked} option(s)`
    } else if (maxChecked && checkedCount > maxChecked) {
      errorMessage =
        messages.maxChecked ||
        `Please select no more than ${maxChecked} option(s)`
    }

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

  // Generic error/success display methods
  #showFieldError = (field, message) => {
    field.classList.add('input-error')
    field.classList.remove('input-valid')

    let errorElement = field.parentNode.querySelector('.field-error')
    if (!errorElement) {
      errorElement = document.createElement('div')
      errorElement.className = 'field-error'
      field.parentNode.appendChild(errorElement)
    }
    errorElement.textContent = message
    errorElement.style.display = 'block'
  }

  #showFieldSuccess = (field) => {
    field.classList.remove('input-error')
    field.classList.add('input-valid')

    const errorElement = field.parentNode.querySelector('.field-error')
    if (errorElement) {
      errorElement.style.display = 'none'
    }
  }

  #clearFieldError = (field) => {
    field.classList.remove('input-error', 'input-valid')
    const errorElement = field.parentNode.querySelector('.field-error')
    if (errorElement) {
      errorElement.style.display = 'none'
    }
  }

  #showCheckboxError = (container, message) => {
    if (container) {
      container.classList.add('error')

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

  // Generic form submission handler
  #handleSubmit = (e) => {
    e.preventDefault()

    const allFieldNames = Array.from(this.#validationRules.keys())
    const validationResults = allFieldNames.map((fieldName) => ({
      fieldName,
      isValid: this.#validateField(fieldName)
    }))

    const allValid = validationResults.every(({ isValid }) => isValid)

    if (allValid) {
      this.submitForm()
    } else {
      const firstInvalidField = validationResults.find(
        ({ isValid, fieldName }) => !isValid && this.#fields[fieldName]
      )?.fieldName

      if (firstInvalidField && this.#fields[firstInvalidField]) {
        this.#fields[firstInvalidField].focus()
      }
    }
  }

  // Generic form submission with customization hooks
  async submitForm() {
    const submitBtn = this.#submitBtn
    const originalText = submitBtn?.textContent || 'Submit'

    // Show loading state
    if (submitBtn) {
      submitBtn.textContent = this.getLoadingText()
      submitBtn.disabled = true
    }

    try {
      // Pre-submission hook (override in subclasses)
      await this.beforeSubmit()

      // Get form data
      const formData = this.getFormData()

      // Validate one more time before submission
      if (!this.validateAll()) {
        throw new Error('Form validation failed')
      }

      // Actual submission (override this method)
      await this.handleSubmission(formData)

      // Post-submission success (override in subclasses if needed)
      await this.afterSubmitSuccess(formData)

      this.showSuccessMessage()
      this.resetForm()
    } catch (error) {
      console.error('Form submission failed:', error)

      // Handle submission error (override in subclasses if needed)
      await this.handleSubmissionError(error)

      this.showError(this.getErrorMessage(error))
    } finally {
      // Reset button state
      if (submitBtn) {
        submitBtn.textContent = originalText
        submitBtn.disabled = false
      }
    }
  }

  // Customization hooks - override these in subclasses
  getLoadingText() {
    return 'Submitting...'
  }

  async beforeSubmit() {
    // Override for pre-submission logic (e.g., additional validation)
  }

  // This MUST be implemented by subclasses
  async handleSubmission(formData) {
    throw new Error('handleSubmission() must be implemented by subclass')
  }

  async afterSubmitSuccess(formData) {
    // Override for post-submission logic (e.g., analytics tracking)
  }

  async handleSubmissionError(error) {
    // Override for custom error handling
  }

  getErrorMessage(error) {
    return 'Submission failed. Please try again.'
  }

  // Generic form reset
  resetForm() {
    this.#form.reset()

    Object.values(this.#fields).forEach((field) => {
      field.classList.remove('input-error', 'input-valid')
      const errorElement = field.parentNode.querySelector('.field-error')
      if (errorElement) {
        errorElement.style.display = 'none'
      }
    })

    document.querySelector('.checkbox-group')?.classList.remove('error')
  }

  // Generic success message display
  showSuccessMessage() {
    this.#successMessage.style.display = 'block'
    this.#successMessage.textContent = 'Form submitted successfully!'

    // this.#form?.scrollIntoView({
    //   behavior: 'smooth'
    // })

    setTimeout(() => {
      this.#successMessage.style.display = 'none'
    }, 5000)
  }

  // Generic error display - can be overridden
  showError(message) {
    alert(message) // Override this for custom error display
  }

  // Public validation methods
  validateAll() {
    const allFieldNames = Array.from(this.#validationRules.keys())
    return allFieldNames.every((fieldName) => this.#validateField(fieldName))
  }

  // Generic form data collection
  getFormData() {
    const data = Object.fromEntries(
      Object.entries(this.#fields).map(([name, field]) => [
        name,
        field?.value ? field.value.trim() : ''
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

// ================================
// CSS STYLES (SHARED)
// ================================
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

// Inject shared styles
const styleSheet = document.createElement('style')
styleSheet.textContent = errorStyles
document.head.appendChild(styleSheet)
