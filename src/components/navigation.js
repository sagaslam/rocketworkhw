export const createNavigation = () => {
  return `
<ul class="links">
          <li><a href="/index.html" data-page="home">home</a></li>

          <li><a href="/pages/projects.html" data-page="projects">projects</a></li>
          <li><a href="/pages/partners.html" data-page="partners">partners</a></li>
          <li><a href="/pages/joinus.html" data-page="joinus">join us</a></li>
          <li><a href="/pages/about.html" data-page="aboutus">about us</a></li>
          <li><a href="/pages/team.html" data-page="team">team</a></li>
          <li><a href="/pages/contact.html" data-page="contactus">contact us</a></li>
        </ul>
        <ul class="icons">
          <li>
            <a href="#" class="icon brands fa-linkedin"
              ><span class="label">LinkedIn</span></a
            >
          </li>
          <li>
            <a href="#" class="icon brands fa-instagram"
              ><span class="label">Instagram</span></a
            >
          </li>
        </ul>
`
}

export const setActiveMenuItem = (currentPage) => {
  document.querySelectorAll('ul.links li').forEach((li) => {
    const link = li.querySelector('a')

    li.classList.remove('active')

    if (link?.getAttribute('data-page')?.includes(currentPage)) {
      li.classList.add('active')
    }
  })
}
