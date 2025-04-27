import { fetchJSON, renderProjects } from '../global.js';

async function loadAndRenderProjects() {
  const projects = await fetchJSON('../lib/projects.json');
  const projectsContainer = document.querySelector('.projects');
  projectsContainer.innerHTML='';
  for(const project of projects){
    renderProjects(project,projectsContainer,'h2');
  }
  const projectCount = document.getElementById('project-count');
  projectCount.textContent = `Total projects: ${projects.length}`;

  const projectsTitle = document.querySelector('.projects-title');
  if (projectsTitle) {
    projectsTitle.textContent = `${projects.length} Projects`;
  }

}

loadAndRenderProjects();
