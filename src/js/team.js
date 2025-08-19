export function initTeam() {
  const buttons = document.querySelectorAll(
    '#team-section .team-filters button'
  )
  const members = document.querySelectorAll('.team-member')
  const modal = document.getElementById('team-modal')
  const modalImage = modal.querySelector('.modal-image img')
  const modalName = modal.querySelector('.modal-name')
  const modalRole = modal.querySelector('.modal-role')
  const modalBio = modal.querySelector('.modal-bio')
  const modalSocial = modal.querySelector('.modal-social')
  const closeBtn = modal.querySelector('.modal-close')

  // Keep track of active roles
  let activeRoles = []

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

        // Ensure "all" is not active
        const allBtn = document.querySelector(
          '#team-section .team-filters button[data-role="all"]'
        )
        if (allBtn) allBtn.classList.remove('active')
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
