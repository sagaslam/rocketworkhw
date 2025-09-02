export default class HeadManager {
  constructor() {
    this.defaultMeta = {
      viewport: 'width=device-width, initial-scale=1.0',
      author: 'Rocket Works | Heriot-Watt University',
      robots: 'index, follow'
    }

    this.defaultLinks = [
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png?2'
      },
      { rel: 'shortcut icon', sizes: 'any', href: '/favicon.ico?2' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: true
      }
    ]
  }

  setTitle(title) {
    document.title = title
    this.setMetaProperty('og:title', title)
    this.setMetaName('twitter:title', title)
  }

  setDescription(description) {
    this.setMetaName('description', description)
    this.setMetaProperty('og:description', description)
    this.setMetaName('twitter:description', description)
  }

  setMetaName(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = name
      document.head.appendChild(meta)
    }
    meta.content = content
  }

  setMetaProperty(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('property', property)
      document.head.appendChild(meta)
    }
    meta.content = content
  }

  addLink(attributes) {
    const existing = this.findExistingLink(attributes)
    if (existing) return

    const link = document.createElement('link')
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'crossorigin' && value === true) {
        link.setAttribute(key, '')
      } else {
        link.setAttribute(key, value)
      }
    })
    document.head.appendChild(link)
  }

  findExistingLink(attributes) {
    const links = document.querySelectorAll('link')
    return Array.from(links).find((link) => {
      return Object.entries(attributes).every(([key, value]) => {
        if (key === 'crossorigin' && value === true) {
          return link.hasAttribute(key)
        }
        return link.getAttribute(key) === value
      })
    })
  }

  init(pageConfig = {}) {
    // Set defaults
    Object.entries(this.defaultMeta).forEach(([name, content]) => {
      this.setMetaName(name, content)
    })

    this.defaultLinks.forEach((link) => this.addLink(link))

    // Apply page config
    if (pageConfig.title) this.setTitle(pageConfig.title)
    if (pageConfig.description) this.setDescription(pageConfig.description)
    if (pageConfig.keywords) this.setMetaName('keywords', pageConfig.keywords)
    if (pageConfig.canonical) {
      this.addLink({ rel: 'canonical', href: pageConfig.canonical })
    }
    if (pageConfig.ogImage) {
      this.setMetaProperty('og:image', pageConfig.ogImage)
    }
  }
}
