import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

async function loadAndRenderProjects() {
  const projects = await fetchJSON('../lib/projects.json');
  const projectsContainer = document.querySelector('.projects');
  projectsContainer.innerHTML='';
  for(const project of projects){
    renderProjects(project,projectsContainer,'h2');
  }
  const projectCount = document.getElementById('project-count');
  projectCount.textContent = `Total projects: ${projects.length}`;
  const rolledData=d3.rollups(
    projects,
    v=>v.length,
    d=>d.year
  );
  const data = rolledData.map(([year, count]) => {
    return { label: year, value: count };
  });
}

let colors = d3.scaleOrdinal(d3.schemeTableau10);
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let sliceGenerator = d3.pie().value(d => d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map(d => arcGenerator(d));
d3.select('#projects-plot').selectAll('*').remove();

arcs.forEach((arcPath, idx) => {
  d3.select('#projects-plot')
    .append('path')
    .attr('d', arcPath)
    .attr('fill', colors(idx));

});

let legend = d3.select('.legend');
legend.selectAll('*').remove();
data.forEach((d, idx) => {
  legend
    .append('li')
    .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
    .attr('class','legend-item')
    .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
});
loadAndRenderProjects();



