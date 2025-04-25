console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
//step 4.2
document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select id="color-scheme-select">
    <option value="light dark">Automatic</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
    </select>
	</label>`,
);


let select = document.querySelector('#color-scheme-select');
//step 4.5 defined a function to avoid releating the code that sets the color scheme twice
function setColorScheme(scheme){
  document.documentElement.style.setProperty('color-scheme',scheme);
  select.value=scheme;
}
if("colorScheme" in localStorage){
  setColorScheme(localStorage.colorScheme);
  
}
select.addEventListener('input', function (event) {
  let value=event.target.value;
  // console.log('color scheme changed to', value);
  localStorage.colorScheme=value;
  setColorScheme(value);
  //document.documentElement.style.setProperty('color-scheme', event.target.value);
});

//step 2
// let navLinks =$$("nav a") //2.1 get all nav links
// //2.2 find the link to the current page
// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname,
//   );
// //2.3 add the current class to the current page link 
// if (currentLink) {
// // or if (currentLink !== undefined)
// currentLink?.classList.add('current');
// }
//body

//step3.1 add navigation menu
let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'cv/', title: 'CV' },
    { url: 'https://github.com/ivvvvvvvy123', title: 'GitHub' },
  ];

  //3.1create a new <nav> element
let nav = document.createElement('nav');
document.body.prepend(nav);
//going throug a for loop to iterate over the page and add <a> in the <nav>
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
? "http://localhost:5500"      
: "https://ivvvvvvvy123.github.io/Yixuan_Xin_Ivy_portfolio";
for (let p of pages) {
  let url = p.url;
  let title = p.title;

  url = !url.startsWith('http') ? BASE_PATH + '/' + url : url;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }

  if (a.host !== location.host) {
    a.target = '_blank';
  }

  nav.append(a);
}
// for (let p of pages) {
//     let url = p.url; 
//     let title = p.title;
//     // next step: create link and add it to nav

//     //nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);

//     //step 3.2 highlighting the current page and opening external link in a new tab
//     let a = document.createElement('a');
//     a.href = url;
//     a.textContent = title;
//     //highlight current page
//     if (a.host === location.host && a.pathname === location.pathname) {
//       a.classList.add('current');
//     }
//     //external links in a new tab
//     if (a.host !== location.host) {
//       a.target = '_blank';
//     }
//     nav.append(a);
// }
// const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
// ? "http://localhost:5500"                  // Local server
// : "https://ivvvvvvvy123.github.io/Yixuan_Xin_Ivy_portfolio";
//making sure work locally and deployed
//url = !url.startsWith('http') ? BASE_PATH + url : url;
export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

// export function renderProjects(project, containerElement) {
//   // Your code will go here
//   containerElement.innerHTML = ''; //clear exisitng content in the project
//   const article = document.createElement('article');
//   article.innerHTML = `
//     <h3>${project.title}</h3>
//     <img src="${project.image}" alt="${project.title}">
//     <p>${project.description}</p>
// `;
//   containerElement.appendChild(article);
// }
export function renderProjects(project, containerElement, headingLevel = 'h2') {
  // write javascript that will allow dynamic heading levels based on previous function
}
