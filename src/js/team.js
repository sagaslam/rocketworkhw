import teamMembers from '@data/team1.json' assert { type: 'json' }

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
    card.dataset.id = member.id
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
                `<a href="${s.url}" target="_blank" rel="noopener noreferrer"  class="icon brands ${s.icon}"><span class="label">${s.platform}</span></a>`
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

  // Filter buttons with mobile-optimized animation
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
      }

      // Animate team members with mobile-optimized batched updates
      const membersToShow = []
      const membersToHide = []

      // First, categorize all members
      members.forEach((member) => {
        const roles = member.dataset.role.split(' ').map((r) => r.trim())
        const shouldShow =
          activeRoles.length === 0 || roles.some((r) => activeRoles.includes(r))

        if (shouldShow) {
          membersToShow.push(member)
        } else {
          membersToHide.push(member)
        }
      })

      // Force immediate cleanup of hidden items for mobile
      members.forEach((member) => {
        if (
          member.classList.contains('hidden') &&
          member.style.display === 'flex'
        ) {
          member.style.display = 'none'
        }
      })

      // Batch hide animations first (faster)
      membersToHide.forEach((member, index) => {
        setTimeout(() => {
          member.classList.remove('show')
          member.classList.add('hidden')

          // Immediate cleanup for mobile - no waiting
          setTimeout(() => {
            if (member.classList.contains('hidden')) {
              member.style.display = 'none'
              // Force grid reflow
              member.parentElement.style.display = 'grid'
            }
          }, 400) // Faster cleanup
        }, index * 20) // Faster hide stagger for mobile
      })

      // Then show animations (ensure proper positioning)
      setTimeout(
        () => {
          membersToShow.forEach((member, index) => {
            setTimeout(() => {
              // Ensure it's ready to show
              member.style.display = 'flex'

              // Force a reflow before animation
              member.offsetHeight

              // Use requestAnimationFrame for smoother DOM updates
              requestAnimationFrame(() => {
                member.classList.remove('hidden')
                member.classList.add('show')

                setTimeout(() => {
                  member.classList.remove('show')
                }, 800)
              })
            }, index * 60) // Slightly faster show stagger
          })
        },
        membersToHide.length > 0 ? 100 : 0
      ) // Shorter wait time
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

  // Initialize with 'All' selected and animate all cards in on page load
  setTimeout(() => {
    members.forEach((member, index) => {
      setTimeout(() => {
        member.classList.add('show')
        setTimeout(() => {
          member.classList.remove('show')
        }, 800)
      }, index * 120) // Slower stagger for initial load
    })
  }, 200) // Longer initial delay
}
