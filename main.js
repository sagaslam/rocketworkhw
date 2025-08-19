import { scrolly } from '@js/scrolly.js'
import HeadManager from '@js/head-manager.js'
import ContactUsValidator from '@js/ContactUsValidator.js'
import JoinUsValidator from '@js/JoinUsValidator.js'
import { pageConfigs } from '@data/page-configs.js'
import { createFooter } from '@components/footer.js'
import { initOrgChart } from '@components/orgChart.js'
import { initParallax } from '@js/parallax.js'
import { initIntro } from '@js/intro.js'
import { initNavPanel } from '@js/navpanel.js'
import { createNavigation, setActiveMenuItem } from '@components/navigation.js'

// Initialize HeadManager
const headManager = new HeadManager()

document.addEventListener('DOMContentLoaded', () => {
  //const validator = new ContactUsValidator()

  // Get current page from body data attribute or URL
  const currentPage = document.body.dataset.page || 'home'

  // Get configuration for current page
  const pageConfig = pageConfigs[currentPage] || pageConfigs.home

  // Initialize head with page-specific config
  headManager.init(pageConfig)

  // only initialize org chart if current page is 'team'
  if (currentPage === 'team') {
    // Initialize org chart
    initOrgChart()
  }

  // only initialize validation class if current page has'join us'
  if (document.querySelector('#joinusForm')) {
    window.JoinUsValidator = new JoinUsValidator()
  }

  // Initialise header and footer
  document.getElementById('nav').innerHTML = createNavigation()
  document.getElementById('footer').innerHTML = createFooter()

  // Ensure DOM is updated before running validator
  //requestAnimationFrame(() => {
  window.ContactUsValidator = new ContactUsValidator()
  //})

  // Set menu active
  setActiveMenuItem(currentPage)

  initParallax(document.getElementById('wrapper'))
  initIntro(document.getElementById('main'))
  initNavPanel({
    navSelector: '#nav',
    panelId: 'navPanel',
    visibleClass: 'is-navPanel-visible'
  })

  //document.body.classList.remove('is-preload')

  setTimeout(() => {
    document.body.classList.remove('is-preload')
  }, 100)

  scrolly('.scrolly', {
    offset: 0, // adjust to your sticky header height
    speed: 200
  })

  console.log(`Page config: ${pageConfig.title}`)
  console.log(`Initialized page: ${currentPage}`)
  console.log(`Page title: ${document.title}`)
})
