import { fetchJSON, renderProjects } from './global.js';
import './ivy.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

/* ---------- Theme selector ---------- */
const select = document.querySelector('#color-scheme-select');
function setColorScheme(scheme) {
  document.documentElement.style.setProperty('color-scheme', scheme);
  select.value = scheme;
}
try {
  if ('colorScheme' in localStorage) setColorScheme(localStorage.colorScheme);
} catch {}
select.addEventListener('input', (e) => {
  try { localStorage.colorScheme = e.target.value; } catch {}
  setColorScheme(e.target.value);
});

/* ---------- Sidebar: highlight the section in view ---------- */
const tocLinks = [...document.querySelectorAll('.toc a')];
const sections = tocLinks.map((a) => document.querySelector(a.getAttribute('href')));
function updateActive() {
  const y = window.scrollY + window.innerHeight * 0.3;
  let current = sections[0];
  for (const s of sections) if (s.offsetTop <= y) current = s;
  // At the very bottom, the last section is the active one
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) current = sections.at(-1);
  tocLinks.forEach((a) => a.classList.toggle('current', a.getAttribute('href') === '#' + current.id));
}
window.addEventListener('scroll', updateActive, { passive: true });
window.addEventListener('resize', updateActive);
updateActive();

/* ---------- Projects: pie chart + search ---------- */
let allProjects = [];
let query = '';
let selectedYear = null;

const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');
const projectCount = document.getElementById('project-count');
const legend = d3.select('.legend');

function visibleProjects() {
  return allProjects.filter((p) => {
    const matchesQuery = Object.values(p).join('\n').toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (selectedYear === null || p.year === selectedYear);
  });
}

function renderList() {
  const list = visibleProjects();
  projectsContainer.innerHTML = '';
  for (const p of list) renderProjects(p, projectsContainer, 'h3');
  projectCount.textContent = `Total projects: ${list.length}`;
}

function renderPieChart() {
  const searched = allProjects.filter((p) =>
    Object.values(p).join('\n').toLowerCase().includes(query.toLowerCase()));
  const data = d3.rollups(searched, (v) => v.length, (d) => d.year)
    .sort((a, b) => d3.ascending(a[0], b[0]))
    .map(([label, value]) => ({ label, value }));
  if (selectedYear !== null && !data.some((d) => d.label === selectedYear)) selectedYear = null;

  const palette = ['#5DB7E8', '#A99BE0', '#86C5A4', '#F2B880', '#E79AB4', '#7F9CDB'];
  const colors = d3.scaleOrdinal(palette).domain(data.map((d) => d.label));
  const radius = 75;
  const arc = d3.arc().innerRadius(0).outerRadius(radius - 5);
  const arcData = d3.pie().value((d) => d.value).sort(null)(data);

  const svg = d3.select('#projects-plot').attr('viewBox', `0 0 ${radius * 2} ${radius * 2}`);
  svg.selectAll('*').remove();
  legend.selectAll('*').remove();
  const g = svg.append('g').attr('transform', `translate(${radius}, ${radius})`);

  const toggle = (label) => {
    selectedYear = selectedYear === label ? null : label;
    renderPieChart();
    renderList();
  };

  arcData.forEach((d) => {
    g.append('path')
      .attr('d', arc(d))
      .attr('fill', colors(d.data.label))
      .attr('class', d.data.label === selectedYear ? 'selected' : '')
      .on('click', () => toggle(d.data.label));
  });

  data.forEach((d) => {
    legend.append('li')
      .attr('style', `--color:${colors(d.label)}`)
      .attr('class', d.label === selectedYear ? 'legend-item selected' : 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => toggle(d.label));
  });
}

searchInput.addEventListener('input', (e) => {
  query = e.target.value;
  renderPieChart();
  renderList();
});

allProjects = (await fetchJSON('./lib/projects.json')) || [];
renderPieChart();
renderList();
updateActive();
