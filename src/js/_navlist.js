/// alt-navlist.js

export function buildNavList(nav) {
  if (!nav) return

  const links = nav.querySelectorAll('a')
  const list = document.createElement('ul')

  links.forEach((link) => {
    const li = document.createElement('li')
    const clone = link.cloneNode(true)

    // Optional: handle indentation from class
    const indentMatch = [...link.classList].find((cls) =>
      cls.startsWith('depth-')
    )
    const indent = indentMatch ? parseInt(indentMatch.split('-')[1], 10) : 0
    clone.style.paddingLeft = `${1.25 + indent * 1.25}em`

    li.appendChild(clone)
    list.appendChild(li)
  })

  return list
}
// navList.js

// export function navList(navElement) {
//   if (!navElement) return ''

//   const links = []

//   const processList = (element, depth = 0) => {
//     Array.from(element.children).forEach((child) => {
//       if (child.tagName === 'LI') {
//         const link = child.querySelector('a')
//         if (link) {
//           const href = link.getAttribute('href')
//           const target = link.getAttribute('target') || ''
//           const text = link.textContent.trim()
//           const indent = '– '.repeat(depth)

//           links.push(
//             `<a class="link depth-${depth}" href="${href}"${
//               target ? ` target="${target}"` : ''
//             }>${indent}${text}</a>`
//           )
//         }

//         const sublist = child.querySelector('ul')
//         if (sublist) processList(sublist, depth + 1)
//       }
//     })
//   }

//   const ul = navElement.querySelector('ul')
//   if (ul) processList(ul)
//   return links.join('')
// }

// // Use it like this inside your navPanel.js or elsewhere:
// // import { navList } from './navList.js';

// // const nav = document.querySelector('#nav');
// // const flattenedNavHTML = navList(nav);
