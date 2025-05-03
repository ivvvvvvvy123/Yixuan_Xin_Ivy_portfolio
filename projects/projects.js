import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let allProjects=[];
let query = '';

const projectsContainer = document.querySelector('.projects');
const searchInput=document.querySelector('.searchBar');
const projectCount = document.getElementById('project-count');
const legend=d3.select('.legend');

function renderPieChart(projectsGiven){
  const rolledData=d3.rollups(
    projectsGiven,
    v=>v.length,
    d=>d.year
  );

  const data = rolledData.map(([year, count]) => ({
    label: year, 
    value: count
  }));
  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  const sliceGenerator = d3.pie().value(d => d.value);
  const arcData = sliceGenerator(data);
  const arcs = arcData.map(d => arcGenerator(d));

  d3.select('#projects-plot').selectAll('*').remove();
  legend.selectAll('*').remove();
  arcs.forEach((arcPath, idx) => {
    d3.select('#projects-plot')
      .append('path')
      .attr('d', arcPath)
      .attr('fill', colors(idx));
  });

  data.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
      .attr('class','legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
  });
}

function renderFilteredProjects(projectsList){
  projectsContainer.innerHTML='';
  for(const project of projectsList){
    renderProjects(project,projectsContainer,'h2');
  }
  projectCount.textContent = `Total projects: ${projectsList.length}`;
}

searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  let filteredProjects = allProjects.filter(project => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  renderFilteredProjects(filteredProjects);
  renderPieChart(filteredProjects);
});

async function loadAndRenderProjects() {
  allProjects= await fetchJSON('../lib/projects.json');
  renderFilteredProjects(allProjects);
  renderPieChart(allProjects);
}
loadAndRenderProjects();
