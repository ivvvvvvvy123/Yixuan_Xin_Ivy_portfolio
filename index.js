import { fetchJSON, renderProjects } from './global.js';

async function loadAndRenderLatestProjects() {
  const projects = await fetchJSON('lib/projects.json');
  const projectsContainer = document.querySelector('.projects');

  projectsContainer.innerHTML = '';

  const latestProjects = projects.slice(0, 3); 

  for (const project of latestProjects) {
    renderProjects(project, projectsContainer, 'h3');
  }
}

loadAndRenderLatestProjects();
