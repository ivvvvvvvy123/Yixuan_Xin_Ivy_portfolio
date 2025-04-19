console.log('IT’S ALIVE!');

// function $$(selector, context = document) {
//   return Array.from(context.querySelectorAll(selector));
// }
// let navLinks =$$("nav a") //2.1 get all nav links

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname,
//   );//2.2 find the link to the current page
// currentLink?.classList.add('current');//2.3 add the current class to the current page link
let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    // add the rest of your pages here
    { url: 'contact/', title: 'Contact' },
    { url: 'cv/', title: 'CV' },
    // { url: 'projects/', title: 'Projects' },
  ];

  //create a new <nav> element
let nav = document.createElement('nav');
document.body.prepend(nav);
for (let p of pages) {
    let url = p.url;
    let title = p.title;
    // next step: create link and add it to nav
  }
  nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);

  const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/website/";         // GitHub Pages repo name

  url = !url.startsWith('http') ? BASE_PATH + url : url;