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

}

loadAndRenderProjects();

let data = [1, 2];

let arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(50);

let sliceGenerator = d3.pie();
let arcData = sliceGenerator(data);

let arcs = arcData.map((d) => arcGenerator(d));

let colors = ['gold', 'purple'];

arcs.forEach((arcPath, idx) => {
  d3.select('#projects-plot') 
    .append('path')
    .attr('d', arcPath)
    .attr('fill', colors[idx]);
});

