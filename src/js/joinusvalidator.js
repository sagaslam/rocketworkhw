import GenericFormValidator from './GenericFormValidator.js'
export default class JoinUsValidator extends GenericFormValidator {
  #scriptUrl

  constructor() {
    //super()

    // JoinUs-specific validation rules
    const joinUsValidationRules = new Map([
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
            required:
              "Please select at least one position you're interested in",
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
            maxLength:
              'Adjustments information must be less than 500 characters'
          }
        }
      ]
    ])

    // Initialize with JoinUs form selector and rules
    super('#joinusForm', joinUsValidationRules)

    this.#scriptUrl = import.meta.env.VITE_GOOGLE_JOINUS_URL
  }

  // JoinUs-specific field ID mapping
  mapFieldNameToId(fieldName) {
    const fieldMapping = {
      fullName: 'fullName',
      email: 'email',
      year: 'year',
      discipline: 'discipline',
      whyJoin: 'whyJoin',
      experience: 'experience',
      additionalInfo: 'additionalInfo',
      adjustments: 'adjustments'
    }

    return fieldMapping[fieldName] || fieldName
  }

  // JoinUs-specific submission implementation
  async handleSubmission(formData) {
    console.log('JoinUs form submitted with data:', formData)

    // Send to Google Sheets
    //if (
    //this.SCRIPT_URL !==
    //'https://script.google.com/macros/s/YOUR_SCRIPT_URL_HERE/exec'
    //) {
    const response = await this.sendToGoogleSheets(formData)
    const result = await response.json()
    //} else {
    // Simulate API call for demo
    //await new Promise((resolve) => setTimeout(resolve, 1500))
    //}
  }

  // JoinUs-specific customizations
  getLoadingText() {
    return 'Joining HW Rocket Works...'
  }

  async beforeSubmit() {
    // JoinUs-specific pre-submission logic
    console.log('Preparing JoinUs submission...')
  }

  async afterSubmitSuccess(formData) {
    // JoinUs-specific post-submission logic
    console.log('Welcome to HW Rocket Works!')

    // Could track analytics, send welcome email, etc.
  }

  getErrorMessage(error) {
    if (error.message.includes('Google Sheets')) {
      return 'Failed to submit application. Please check your connection and try again.'
    }
    return 'Application submission failed. Please try again or contact support.'
  }

  // JoinUs-specific Google Sheets integration (if needed)
  async sendToGoogleSheets(formData) {
    const response = await fetch(this.#scriptUrl, {
      method: 'POST',
      body: this.getFormDataEncoded(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to submit to Google Sheets')
    }

    return response
  }
}
