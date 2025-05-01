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

let arc = d3.arc().innerRadius(0).outerRadius(50)({
  startAngle: 0,
  endAngle: 2 * Math.PI,
});
d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');