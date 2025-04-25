import { fetchJSON, renderProjects } from '../global.js';

async function loadAndRenderProjects() {
  const projects = await fetchJSON('../projects.json'); // adjust path if needed
  const projectsContainer = document.querySelector('.project'); // match HTML
  renderProjects(projects, projectsContainer, 'h2');
}

loadAndRenderProjects();
