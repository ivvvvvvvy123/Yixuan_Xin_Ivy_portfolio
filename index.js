import { fetchJSON, renderProjects } from './global.js';

async function loadAndRenderLatestProjects() {
  const projects = await fetchJSON('./lib/projects.json');
  const latestProjects = projects.slice(0, 3);

  const projectsContainer = document.querySelector('.projects');

  projectsContainer.innerHTML = '';

  for (const project of latestProjects) {
    renderProjects(project, projectsContainer, 'h2');
  }
}

loadAndRenderLatestProjects();
