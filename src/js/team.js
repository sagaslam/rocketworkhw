export function initTeamFilters() {
  const buttons = document.querySelectorAll(
    '#team-section .team-filters button'
  )
  const members = document.querySelectorAll('#team-section .team-member')

  if (!buttons.length || !members.length) return

  const fadeDuration = 300
  const staggerDelay = 100

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.role

      // Update active button
      buttons.forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')

      // Show/hide members with staggered fade
      members.forEach((member, index) => {
        setTimeout(() => {
          const roles = member.dataset.role.split(' ') // get all roles
          if (role === 'all' || roles.includes(role)) {
            member.classList.remove('hidden')
          } else {
            member.classList.add('hidden')
          }
        }, index * staggerDelay)
      })
    })
  })
}
