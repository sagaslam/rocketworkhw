import GenericFormValidator from './GenericFormValidator.js'

export default class ContactUsValidator extends GenericFormValidator {
  #scriptUrl
  #charCount

  constructor() {
    // Contact Us specific validation rules
    const contactUsValidationRules = new Map([
      [
        'fullName',
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

    // Initialize with contact form selector and rules
    super('#contactForm', contactUsValidationRules)

    this.#scriptUrl = import.meta.env.VITE_GOOGLE_CONTACTUS_URL

    this.#charCount = document.querySelector('#charCount')

    // Hook up live char count if both message field and counter exist
    const messageField = document.querySelector('#message')

    if (messageField && this.#charCount) {
      messageField.addEventListener('input', this.#updateCharCount)
      this.#updateCharCount() // Initialize on page load
    }
  }

  #updateCharCount = () => {
    const messageField = document.querySelector('#message')
    if (!messageField) return

    const { value } = messageField
    const maxLength = 500

    this.#charCount.textContent = `${value.length} / ${maxLength}`

    // Add styling classes for warning/error states
    this.#charCount.className = `char-count ${
      value.length > 450 ? 'error' : value.length > 400 ? 'warning' : ''
    }`.trim()
  }

  mapFieldNameToId(fieldName) {
    const fieldMapping = {
      fullName: 'contactName',
      email: 'contactEmail',
      message: 'message'
    }

    return fieldMapping[fieldName] || fieldName
  }

  // contact us specific submission implementation
  async handleSubmission(formData) {
    console.log('Contact form submitted with data:', formData)

    const response = await this.sendToGoogleSheets(formData)
    const result = await response.json()
  }

  // contact us specific customizations
  getLoadingText() {
    return 'Sending to HW Rocket Works...'
  }

  async beforeSubmit() {
    // contact us specific pre-submission logic
    console.log('Preparing contact us submission...')
  }

  async afterSubmitSuccess(formData) {
    // contact us specific post-submission logic
    console.log('Welcome to HW Rocket Works!')

    // Could track analytics, send welcome email, etc.
  }

  getErrorMessage(error) {
    if (error.message.includes('Google Sheets')) {
      return 'Unable to submit application. Please try again or contact us by email.'
    }
    return 'Unable to submit application. Please try again or contact us by email.'
  }

  async sendToGoogleSheets(formData) {
    const response = await fetch(this.#scriptUrl, {
      method: 'POST',
      body: this.getFormDataEncoded(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (!response.ok) {
      throw new Error(
        'Unable to submit application. Please try again or contact us by email.'
      )
    }

    return response
  }
}
