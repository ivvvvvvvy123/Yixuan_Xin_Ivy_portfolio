import { fetchJSON, renderProjects } from '../global.js';

async function loadAndRenderProjects() {
  const projects = await fetchJSON('../projects.json'); // adjust path if needed
  const projectsContainer = document.querySelector('.project'); // match HTML
  projectsContainer.innerHTML='';
  for(const project of projects){
    renderProjects(project,projectsContainer,'h2');
  }
}

loadAndRenderProjects();
