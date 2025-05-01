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
//lab5 step 1
//1.4 set up data
let data = [1, 2];//33% and 66%
//calculate total
let total = 0;
for (let d of data) {
  total += d;
}
//calculate stat and end angles for each slice
let angle = 0;
let arcData = [];

for (let d of data) {
  let endAngle = angle + (d / total) * 2 * Math.PI;
  arcData.push({ startAngle: angle, endAngle });
  angle = endAngle;
}

//calculate actual path for each slice
let arcs = arcData.map((d) => arcGenerator(d));
//translate artcs array into <path> element
let colors = ['gold', 'purple'];
arcs.forEach((arc, idx) => {
  d3.select('svg')
    .append('path')
    .attr('d', arc)
    .attr('fill',colors[idx]) 
})
