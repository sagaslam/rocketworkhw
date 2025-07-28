import HeadManager from '@js/head-manager.js'
import ContactUsValidator from '@js/ContactUsValidator.js'
import { pageConfigs } from '@data/page-configs.js'
import { createFooter } from '@components/footer.js'
import { initOrgChart, waitForLibraries } from '@components/orgChart.js'

import { createNavigation, setActiveMenuItem } from '@components/navigation.js'

import '@js/jquery.min.js'
import '@js/jquery.scrollex.min.js'
import '@js/jquery.scrolly.min.js'
import '@js/util.js'
import '@js/main.js'

// Initialize HeadManager
const headManager = new HeadManager()

document.addEventListener('DOMContentLoaded', () => {
  const validator = new ContactUsValidator()
  window.ContactUsValidator = validator

  // Get current page from body data attribute or URL
  const currentPage = document.body.dataset.page || 'home'

  // Get configuration for current page
  const pageConfig = pageConfigs[currentPage] || pageConfigs.home

  // Initialize head with page-specific config
  headManager.init(pageConfig)

  // only initialize org chart if current page is 'team'
  if (currentPage === 'team') {
    // Initialize org chart after libraries are loaded
    waitForLibraries().then(() => {
      initOrgChart()
    })
  }

  // Initialise header and footer
  document.getElementById('nav').innerHTML = createNavigation()
  document.getElementById('footer').innerHTML = createFooter()

  // Set menu active
  setActiveMenuItem(currentPage)

  console.log(`Page config: ${pageConfig.title}`)
  console.log(`Initialized page: ${currentPage}`)
  console.log(`Page title: ${document.title}`)
})
