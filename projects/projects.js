import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let allProjects=[];
let query = '';
let selectedIndex = -1; 


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
  //step 5.3
  const selectedYear =data[selectedIndex]?.label;
  
  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(60);
  const sliceGenerator = d3.pie().value(d => d.value);
  const arcData = sliceGenerator(data);
  const arcs = arcData.map(d => arcGenerator(d));
  const radius=75;
  const svg=d3.select('#projects-plot').attr('width',radius*2).attr('height',radius*2).attr('viewBox', `0 0 ${radius * 2} ${radius * 2}`);
  svg.selectAll('*').remove();
  legend.selectAll('*').remove();
  const g = svg.append('g')
  .attr('transform', `translate(${radius}, ${radius})`);


  arcs.forEach((arc, i) => {
    g
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .on('click', () => {
        selectedIndex=selectedIndex===i?-1:i;
        svg.selectAll('path').attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');

        legend.selectAll('li').attr('class', (_, idx) => idx === selectedIndex ? 'legend-item selected' : 'legend-item');
        const filtered = selectedIndex === -1
        ? projectsGiven
        : projectsGiven.filter(p => p.year === data[selectedIndex].label);
        renderFilteredProjects(filtered);
      });
      
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