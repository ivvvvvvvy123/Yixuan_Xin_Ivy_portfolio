console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
let navLinks =$$("nav a") //2.1 get all nav links
//2.2 find the link to the current page
let currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname,
  );
//2.3 add the current class to the current page link 
if (currentLink) {
// or if (currentLink !== undefined)
currentLink?.classList.add('current');
}

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    // add the rest of your pages here
    { url: 'contact/', title: 'Contact' },
    { url: 'cv/', title: 'CV' },
    { url: 'https://github.com/ivvvvvvvy123', title: 'GitHub' },
  ];

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
? "/"                  // Local server
: "/Yixuan_Xin_Ivy_portfolio/";         // GitHub Pages repo name

  //create a new <nav> element
let nav = document.createElement('nav');
document.body.prepend(nav);
for (let p of pages) {
    let url = p.url;
    let title = p.title;
    // next step: create link and add it to nav
    url = !url.startsWith('http') ? BASE_PATH + url : url;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname,
    );
    a.toggleAttribute('target', a.host !== location.host);
    nav.append(a);
}
