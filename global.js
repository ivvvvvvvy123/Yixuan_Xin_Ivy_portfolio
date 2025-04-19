console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
let navLinks =$$("nav a") //2.1 get all nav links

let currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname,
  );//2.2 find the link to the current page
currentLink?.classList.add('current');//2.3 add the current class to the current page link