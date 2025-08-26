import teamMembers from '@data/team.json' assert { type: 'json' }

export function initTeam() {
  const teamGrid = document.querySelector('.team-grid')
  const filterContainer = document.querySelector('.team-filters')

  const modal = document.getElementById('team-modal')
  const modalImage = modal.querySelector('.modal-image img')
  const modalName = modal.querySelector('.modal-name')
  const modalRole = modal.querySelector('.modal-role')
  const modalBio = modal.querySelector('.modal-bio')
  const modalSocial = modal.querySelector('.modal-social')
  const closeBtn = modal.querySelector('.modal-close')

  // Keep track of active roles
  let activeRoles = []

  // --------------------------
  // Build unique roles from JSON
  // --------------------------
  const rolesSet = new Set()
  teamMembers.forEach((member) => member.roles.forEach((r) => rolesSet.add(r)))
  const roles = Array.from(rolesSet).sort()

  // Add "All" button first
  const allBtn = document.createElement('button')
  allBtn.textContent = 'All'
  allBtn.classList.add('button', 'small', 'active')
  allBtn.dataset.role = 'all'
  filterContainer.appendChild(allBtn)

  // Add buttons for each role
  roles.forEach((role) => {
    const btn = document.createElement('button')
    btn.textContent = role.charAt(0).toUpperCase() + role.slice(1)
    btn.classList.add('button', 'small')
    btn.dataset.role = role
    filterContainer.appendChild(btn)
  })

  // --------------------------
  // Generate team cards from JSON
  // --------------------------
  teamMembers.forEach((member) => {
    const card = document.createElement('div')
    card.classList.add('team-member')
    card.dataset.role = member.roles.join(' ')
    card.dataset.bio = member.bio
    card.dataset.name = member.name

    card.innerHTML = `
      <div class="member-image">
        <img src="${member.image}" alt="${member.name}">
      </div>
      <div class="member-info">
        <h4>${member.name}</h4>
        <h5>${member.role}</h5>
        <div class="member-social">
          ${member.social
            .map(
              (s) =>
                `<a href="${s.url}" class="icon ${s.icon}"><span class="label">${s.platform}</span></a>`
            )
            .join('')}
        </div>
      </div>
    `
    teamGrid.appendChild(card)
  })

  const buttons = document.querySelectorAll(
    '#team-section .team-filters button'
  )
  const members = document.querySelectorAll('.team-member')

  // Filter buttons
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.role

      if (role === 'all') {
        // Clicking "all" clears other selections
        activeRoles = []
        buttons.forEach((b) => b.classList.remove('active'))
        btn.classList.add('active')
      } else {
        // Toggle the clicked role in activeRoles
        if (activeRoles.includes(role)) {
          activeRoles = activeRoles.filter((r) => r !== role)
          btn.classList.remove('active')
        } else {
          activeRoles.push(role)
          btn.classList.add('active')
        }

        // Remove active from "All"
        buttons.forEach((b) => {
          if (b.dataset.role === 'all') b.classList.remove('active')
        })

        // Ensure "all" is not active
        // const allBtn = document.querySelector(
        //   '#team-section .team-filters button[data-role="all"]'
        // )
        // if (allBtn) allBtn.classList.remove('active')
      }

      // Show/hide team members
      members.forEach((member) => {
        const roles = member.dataset.role.split(' ').map((r) => r.trim())
        const show =
          activeRoles.length === 0 || roles.some((r) => activeRoles.includes(r))
        member.classList.toggle('hidden', !show)
      })
    })
  })

  // Modal open
  members.forEach((member) => {
    member.addEventListener('click', (e) => {
      if (e.target.closest('a')) return // ignore clicks on links

      const img = member.querySelector('img')
      modalImage.src = img.src
      modalImage.alt = img.alt
      modalName.textContent = member.querySelector('h4').textContent
      modalRole.textContent = member.querySelector('h5').textContent
      modalBio.textContent = member.dataset.bio || 'Bio not available.'

      // Clone social links
      // modalSocial.innerHTML = ''
      // member.querySelectorAll('.social a').forEach((link) => {
      //   const cloned = link.cloneNode(true)
      //   cloned.classList.add('modal-icon')
      //   modalSocial.appendChild(cloned)
      // })

      modal.classList.remove('hidden')
    })
  })

  const closeModal = () => modal.classList.add('hidden')
  closeBtn.addEventListener('click', closeModal)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal()
  })
}
